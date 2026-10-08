/* eslint-disable no-dupe-else-if */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateOrderDto, UpdateOrderDto } from 'src/dto/order.dto';
import { UpdateOnlyOperatorDataOrderDto } from 'src/dto/update-only-operator-data-order';
import { OrderChangeState } from 'src/interfaces/order-change-state';
import { NotificationsService } from 'src/services/notification.service';
import { Customer, CustomerDocument } from 'src/schemas/customers.schema';
import { Operator, OperatorDocument } from 'src/schemas/operators.schema';
import { OrderState, OrderStateDocument } from 'src/schemas/order-state.schema';
import { Order, OrderDocument } from 'src/schemas/order.schema';
import { Product, ProductDocument } from 'src/schemas/product.schema';
import { DocumentCounter, DocumentCounterDocument } from 'src/schemas/document-counter.schema';

@Injectable()
export class OrderService implements OnModuleInit {
  constructor(
    private notifications: NotificationsService,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Operator.name) private operatorModel: Model<OperatorDocument>,
    @InjectModel(OrderState.name) private orderStateModel: Model<OrderStateDocument>,
    @InjectModel(Customer.name) private readonly customerModel: Model<CustomerDocument>,
    @InjectModel(DocumentCounter.name) private documentCounterModel: Model<DocumentCounterDocument>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.backfillDocumentNumbers();
  }

  private async getNextDocumentNumber(key: 'quote' | 'order'): Promise<number> {
    const counter = await this.documentCounterModel.findOneAndUpdate(
      { key },
      { $inc: { sequence: 1 } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).exec();

    return counter.sequence;
  }

  private async reserveDocumentNumbers(
    key: 'quote' | 'order',
    quantity: number
  ): Promise<number[]> {
    if (quantity === 0) return [];

    const counter = await this.documentCounterModel.findOneAndUpdate(
      { key },
      { $inc: { sequence: quantity } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).exec();
    const firstNumber = counter.sequence - quantity + 1;

    return Array.from({ length: quantity }, (_, index) => firstNumber + index);
  }

  private async syncCounter(key: 'quote' | 'order', value: number): Promise<void> {
    await this.documentCounterModel.updateOne(
      { key },
      { $max: { sequence: value } },
      { upsert: true, setDefaultsOnInsert: true }
    ).exec();
  }

  /**
   * Assegna una numerazione ai documenti creati prima dell'introduzione dei
   * progressivi separati. I preventivi e gli ordini usano contatori distinti.
   */
  private async backfillDocumentNumbers(): Promise<void> {
    const [latestQuote, latestOrder] = await Promise.all([
      this.orderModel
        .findOne({ quoteNumber: { $type: 'number' } })
        .sort({ quoteNumber: -1 })
        .select('quoteNumber')
        .lean(),
      this.orderModel
        .findOne({ orderNumber: { $type: 'number' } })
        .sort({ orderNumber: -1 })
        .select('orderNumber')
        .lean()
    ]);

    await Promise.all([
      this.syncCounter('quote', latestQuote?.quoteNumber ?? 0),
      this.syncCounter('order', latestOrder?.orderNumber ?? 0)
    ]);

    const missingNumber = [
      { quoteNumber: { $exists: false } },
      { quoteNumber: null }
    ];
    const missingOrderNumber = [
      { orderNumber: { $exists: false } },
      { orderNumber: null }
    ];

    const [quotes, orders] = await Promise.all([
      this.orderModel
        .find({ status: null, $or: missingNumber })
        .sort({ createdAt: 1, _id: 1 })
        .select('_id')
        .lean(),
      this.orderModel
        .find({ status: { $ne: null }, $or: missingOrderNumber })
        .sort({ createdAt: 1, _id: 1 })
        .select('_id')
        .lean()
    ]);

    const [quoteNumbers, orderNumbers] = await Promise.all([
      this.reserveDocumentNumbers('quote', quotes.length),
      this.reserveDocumentNumbers('order', orders.length)
    ]);

    await Promise.all([
      quotes.length
        ? this.orderModel.bulkWrite(
            quotes.map((quote, index) => ({
              updateOne: {
                filter: {
                  _id: quote._id,
                  $or: [
                    { quoteNumber: { $exists: false } },
                    { quoteNumber: null }
                  ]
                },
                update: { $set: { quoteNumber: quoteNumbers[index] } }
              }
            }))
          )
        : Promise.resolve(),
      orders.length
        ? this.orderModel.bulkWrite(
            orders.map((order, index) => ({
              updateOne: {
                filter: {
                  _id: order._id,
                  $or: [
                    { orderNumber: { $exists: false } },
                    { orderNumber: null }
                  ]
                },
                update: { $set: { orderNumber: orderNumbers[index] } }
              }
            }))
          )
        : Promise.resolve()
    ]);

    await this.orderModel.updateMany(
      {
        status: { $ne: null },
        $or: [
          { approvedAt: { $exists: false } },
          { approvedAt: null }
        ]
      },
      [
        {
          $set: {
            approvedAt: {
              $cond: [
                { $eq: [{ $type: '$quoteNumber' }, 'number'] },
                { $ifNull: ['$updatedAt', { $ifNull: ['$createdAt', '$insertDate'] }] },
                { $ifNull: ['$createdAt', '$insertDate'] }
              ]
            }
          }
        }
      ]
    ).exec();
  }

  async create(dto: CreateOrderDto): Promise<Order> {
    const isQuote = !dto.status;
    const documentNumber = await this.getNextDocumentNumber(isQuote ? 'quote' : 'order');
    const createdOrder = new this.orderModel({
      ...dto,
      ...(isQuote
        ? { quoteNumber: documentNumber }
        : { orderNumber: documentNumber, approvedAt: new Date() }),
      customerId: new Types.ObjectId(dto.customerId),
      operatorId: dto.operatorId  ? new Types.ObjectId(dto.operatorId) : null,
      status: dto.status  ? new Types.ObjectId(dto.status) : null,
      sectorId: new Types.ObjectId(dto.sectorId),
      createdAt: new Date()
    });

    for (const op of dto.orderProducts) {
      await this.productModel.updateOne(
        { _id: op._id },
        { $inc: { stock: -op.quantity } } 
      );
    }

    const result = createdOrder.save();

    if(dto.isCustomer === true)
    {
      const customer = await this.customerModel.findById(dto.customerId);
      if (!customer) {
        throw new NotFoundException(`customer con ID ${dto.customerId} non trovato`);
      }
      const customerName = customer.businessName;

      void this.notifications.create(
        null,
        'admin',
        'sendNewQuotation',
        { p: customerName },
      ).catch(() => undefined);
    }

    return result;
  }

  async findAll(
    page = 1,
    limit = 20,
    customerId?: string,
    operatorId?: string,
    sectorId?: string,
    status?: string,
    start?: string,
    end?: string,
    admin?: string,
    preventivo?: boolean
  ): Promise<{
      data: Order[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }> {
    const filter: any = {};
    const isAdmin = admin === 'true';


    if (customerId && Types.ObjectId.isValid(customerId)) {
      filter.customerId = new Types.ObjectId(customerId);
    }

    if (sectorId && Types.ObjectId.isValid(sectorId)) {
      filter.sectorId = new Types.ObjectId(sectorId);
    }

    if (!isAdmin) {
      // Se non è admin → mostra solo ordini senza operatore o con il suo ID
      if (operatorId && Types.ObjectId.isValid(operatorId)) {
        filter.$or = [
          { operatorId: null },
          { operatorId: new Types.ObjectId(operatorId) }
        ];
      }
    } 
    else 
    {
      // Se è admin → filtra solo per operatorId (se fornito)
      if (operatorId && Types.ObjectId.isValid(operatorId)) {
        filter.operatorId = new Types.ObjectId(operatorId);
      }
    }


    if(preventivo)
      filter.status = null; 
    else
    {
      if (status) 
        filter.status = status;
      else
        filter.status = { $ne: null };
    }

    if (start && end) {
      const s = new Date(start);
      const e = new Date(end);

      // Creiamo date in UTC per evitare problemi di fuso orario
      const startDate = new Date(Date.UTC(s.getFullYear(), s.getMonth(), s.getDate(), 0, 0, 0));
      const endDate = new Date(Date.UTC(e.getFullYear(), e.getMonth(), e.getDate(), 23, 59, 59, 999));

      filter.insertDate = {
        $gte: startDate,
        $lte: endDate
      };
    }

    // Calcolo offset
    const skip = (page - 1) * limit;

  // Eseguo in parallelo il conteggio totale e il fetch dei dati
    const [total, data] = await Promise.all([
      this.orderModel.countDocuments(filter),
      this.orderModel
        .find(filter)
        .populate('customerId', 'name businessName vatNumber')
        .populate('operatorId', 'name businessName')
        .populate('sectorId', 'name')
        .populate('status', 'name color')
        .sort({ createdAt: -1, _id: -1 })
        .skip(skip)
        .limit(limit)
        .exec()
    ]);

    // Restituisco i dati impaginati
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel
      .findById(id)
      .populate('customerId', 'name businessName vatNumber')
      .populate('operatorId', 'name businessName')
      .populate('sectorId', 'name')
      .populate('status', 'name color')
      .exec();

    if (!order) {
      throw new NotFoundException(`Order ${id} non trovato`);
    }

    return order;
  }
 
  async convertToOrder(dto: any): Promise<Order> {
      const existingOrder = await this.orderModel.findById(dto.orderId);
      if (!existingOrder) {
        throw new NotFoundException(`Order ${dto.orderId} non trovato`);
      }

      const orderNumber = existingOrder.orderNumber
        ?? await this.getNextDocumentNumber('order');

      const updateData: any = {
        orderNumber,
        approvedAt: existingOrder.approvedAt ?? new Date(),
        sectorId: Types.ObjectId.createFromHexString(dto.sectorId),
        updatedAt: new Date(),
        status: dto.status,
        operatorId: dto.operatorId
          ? Types.ObjectId.createFromHexString(dto.operatorId)
          : null
      };

      const updated = await this.orderModel.findByIdAndUpdate(
        dto.orderId,
        { $set: updateData },
        { new: true }
      );

      
        void this.notifications.create(
          (existingOrder.customerId as Types.ObjectId).toString(),
          'customer',
          'createOrderFromQuotation',
          { id: (existingOrder._id as Types.ObjectId).toString() },
        ).catch(() => undefined);


      return updated as Order;
  };

  async update(id: string, dto: UpdateOrderDto, operatorId?: string): Promise<Order> {
    const existingOrder = await this.orderModel.findById(id);
    if (!existingOrder) {
      throw new NotFoundException(`Order ${id} non trovato`);
    }

    // 1️⃣ Ripristino stock dei vecchi prodotti
    for (const oldProd of existingOrder.orderProducts) {
      await this.productModel.updateOne(
        { _id: oldProd._id },
        { $inc: { stock: oldProd.quantity } }
      );
    }

    // 2️⃣ Aggiornamento stock dei nuovi prodotti
    for (const newProd of dto.orderProducts) {
      await this.productModel.updateOne(
        { _id: newProd._id },
        { $inc: { stock: -newProd.quantity } }
      );
    }

    // 3️⃣ Tracciamento cambio status
    const changeState: OrderChangeState[] = existingOrder.orderChangeState || [];
    if (dto.status && dto.status !== (existingOrder.status ? existingOrder.status.toString() : null)) 
    {
      let operatorName = "";

      if (operatorId) {
        const operator = await this.operatorModel.findById(operatorId).select('lastName name businessName');
        if (operator) {
          operatorName = operator.businessName
            ? operator.businessName
            : `${operator.name || ''} ${operator.lastName || ''}`.trim();
        }
      }

      changeState.push({
        orderState: (existingOrder.status as Types.ObjectId).toString(),
        orderId: (existingOrder._id as Types.ObjectId).toString(),
        oldStatus: (existingOrder.status as Types.ObjectId).toString(),
        newStatus: dto.status,
        changedAt: new Date(),
        operatorId: operatorId,
        operatorName: operatorName || 'Amministrazione'
      });

      const status = await this.orderStateModel.findById(dto.status).lean();
      if(status){
        if(existingOrder.status)
          void this.notifications.create(
            (existingOrder.customerId as Types.ObjectId).toString(),
            'customer',
            'updateOrderStatus',
            { id: (existingOrder._id as Types.ObjectId).toString(), status: status.name },
          ).catch(() => undefined);
        else
          void this.notifications.create(
            (existingOrder.customerId as Types.ObjectId).toString(),
            'customer',
            'createOrderFromQuotation',
            { id: (existingOrder._id as Types.ObjectId).toString() },
          ).catch(() => undefined);
      }

    }

    // 4️⃣ Aggiornamento ordine
    const updateData: any = {
      ...dto,
      customerId: new Types.ObjectId(dto.customerId),
      sectorId: new Types.ObjectId(dto.sectorId),
      updatedAt: new Date(),
      orderChangeState: changeState,
    };

    if (!existingOrder.status && dto.status) {
      if (!existingOrder.orderNumber) {
        updateData.orderNumber = await this.getNextDocumentNumber('order');
      }
      updateData.approvedAt = existingOrder.approvedAt ?? new Date();
    }

   updateData.operatorId = dto.operatorId ? new Types.ObjectId(dto.operatorId) : null;

    const updated = await this.orderModel.findByIdAndUpdate(id, updateData, { new: true });

    return updated as Order;
  }

  async updateOnlyOperatorDataOrder(dto: UpdateOnlyOperatorDataOrderDto): Promise<boolean> {
    console.log('Ricevuto DTO:', dto);
    const existingOrder = await this.orderModel.findById(dto.orderId);
    if (!existingOrder) {
      throw new NotFoundException(`Order ${dto.orderId} non trovato`);
    }

    // 1 Tracciamento cambio status
    const changeState: OrderChangeState[] = existingOrder.orderChangeState || [];
    if (dto.status && dto.status !== (existingOrder.status ? existingOrder.status.toString() : null)) 
    {
      let operatorName = "";

      if (dto.operatorId) {
        const operator = await this.operatorModel.findById(dto.operatorId).select('lastName name businessName');
        if (operator) {
          operatorName = operator.businessName
            ? operator.businessName
            : `${operator.name || ''} ${operator.lastName || ''}`.trim();
        }
      }

      changeState.push({
        orderState: (existingOrder.status as Types.ObjectId).toString(),
        orderId: (existingOrder._id as Types.ObjectId).toString(),
        oldStatus: (existingOrder.status as Types.ObjectId).toString(),
        newStatus: dto.status,
        changedAt: new Date(),
        operatorId: dto.operatorId,
        operatorName: operatorName || 'Amministrazione'
      });
    }

    // 2 Aggiornamento ordine
    const updateData: any = {
      updatedAt: new Date(),
      status: dto.status,
      orderChangeState: changeState,
    };

    if (!existingOrder.status && dto.status) {
      if (!existingOrder.orderNumber) {
        updateData.orderNumber = await this.getNextDocumentNumber('order');
      }
      updateData.approvedAt = existingOrder.approvedAt ?? new Date();
    }

   updateData.operatorId = dto.operatorId ? new Types.ObjectId(dto.operatorId) : null;

    const updated = await this.orderModel.findByIdAndUpdate(dto.orderId,
    { $set: updateData },
    { new: true });

    return updated ? true : false;
  }

  async remove(id: string): Promise<boolean> {
    const order = await this.orderModel.findById(id);
    if (!order)
      return false;

    for (const op of order.orderProducts) {
      await this.productModel.findByIdAndUpdate(op._id, {
        $inc: { stock: op.quantity }
      });
    }

    await this.orderModel.findByIdAndDelete(id);

    return true;
  }

}

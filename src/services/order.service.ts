/* eslint-disable no-dupe-else-if */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateOrderDto, UpdateOrderDto } from 'src/dto/order.dto';
import { OrderStatus } from 'src/enum/enum';
import { OrderChangeState } from 'src/interfaces/order-change-state';
import { Operator, OperatorDocument } from 'src/schemas/operators.schema';
import { Order, OrderDocument } from 'src/schemas/order.schema';
import { Product, ProductDocument } from 'src/schemas/product.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Operator.name) private operatorModel: Model<OperatorDocument>,
    
  ) {}

  async create(dto: CreateOrderDto): Promise<Order> {
    const createdOrder = new this.orderModel({
      ...dto,
      customerId: new Types.ObjectId(dto.customerId),
      operatorId: dto.operatorId  ? new Types.ObjectId(dto.operatorId) : null,
      sectorId: new Types.ObjectId(dto.sectorId),
      createdAt: new Date()
    });

    for (const op of dto.orderProducts) {
      await this.productModel.updateOne(
        { _id: op._id },
        { $inc: { stock: -op.quantity } } 
      );
    }

    return createdOrder.save();
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
    admin?: string
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

    if (status) 
      filter.status = status;
    else
      filter.status = { $ne: OrderStatus.PREVENTIVO }; 

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
        .populate('customerId', 'name businessName')
        .populate('operatorId', 'name businessName')
        .populate('sectorId', 'name')
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
      .populate('customerId', 'name businessName')
      .populate('operatorId', 'name businessName')
      .populate('sectorId', 'name')
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

      const updateData: any = {
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
    if (dto.status && dto.status !== existingOrder.status) {
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
        orderState: existingOrder.status,  // stato precedente
        orderId: (existingOrder._id as Types.ObjectId).toString(),
        oldStatus: existingOrder.status,
        newStatus: dto.status,
        changedAt: new Date(),
        operatorId: operatorId,
        operatorName: operatorName || 'Amministrazione'
      });
    }

    // 4️⃣ Aggiornamento ordine
    const updateData: any = {
      ...dto,
      customerId: new Types.ObjectId(dto.customerId),
      sectorId: new Types.ObjectId(dto.sectorId),
      updatedAt: new Date(),
      orderChangeState: changeState,
    };

   updateData.operatorId = dto.operatorId ? new Types.ObjectId(dto.operatorId) : null;

    const updated = await this.orderModel.findByIdAndUpdate(id, updateData, { new: true });

    return updated as Order;
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

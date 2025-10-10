/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateOrderDto, UpdateOrderDto } from 'src/dto/order.dto';
import { Order, OrderDocument } from 'src/schemas/order.schema';
import { Product, ProductDocument } from 'src/schemas/product.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>
  ) {}

  async create(dto: CreateOrderDto): Promise<Order> {
    const createdOrder = new this.orderModel({
      ...dto,
      customerId: new Types.ObjectId(dto.customerId),
      operatorId: new Types.ObjectId(dto.operatorId),
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
    status?: string,
    start?: string,
    end?: string
  ): Promise<{
      data: Order[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }> {
    const filter: any = {};

    if (customerId && Types.ObjectId.isValid(customerId)) {
      filter.customerId = new Types.ObjectId(customerId);
    }

    if (operatorId && Types.ObjectId.isValid(operatorId)) {
      filter.operatorId = new Types.ObjectId(operatorId);
    }    
    
    if (status) filter.status = status;

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
      .populate('customerId', 'name')
      .populate('operatorId', 'name')
      .populate('sectorId', 'name')
      .exec();

    if (!order) {
      throw new NotFoundException(`Order ${id} non trovato`);
    }

    return order;
  }

  async update(id: string, dto: UpdateOrderDto): Promise<Order> {
    const existingOrder = await this.orderModel.findById(id);
    if (!existingOrder) {
      throw new NotFoundException(`Order ${id} non trovato`);
    }

    for (const oldProd of existingOrder.orderProducts) {
      await this.productModel.updateOne(
        { _id: oldProd._id },
        { $inc: { stock: oldProd.quantity } } 
      );
    }

    for (const newProd of dto.orderProducts) {
      await this.productModel.updateOne(
        { _id: newProd._id },
        { $inc: { stock: -newProd.quantity } }
      );
    }

    const updated = await this.orderModel.findByIdAndUpdate(
      id,
      {
        ...dto,
        customerId: new Types.ObjectId(dto.customerId),
        operatorId: new Types.ObjectId(dto.operatorId),
        updatedAt: new Date(),
      },
      { new: true },
    );

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

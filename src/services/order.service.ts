import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateOrderDto, UpdateOrderDto } from 'src/dto/order.dto';
import { Order, OrderDocument } from 'src/schemas/order.schema';

@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private orderModel: Model<OrderDocument>) {}

  async create(dto: CreateOrderDto): Promise<Order> {
    const createdOrder = new this.orderModel({
      ...dto,
      customerId: new Types.ObjectId(dto.customerId),
      operatorId: new Types.ObjectId(dto.operatorId),
      createdAt: new Date()
    });
    return createdOrder.save();
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel
      .find()
      .populate('customerId', 'name')
      .populate('operatorId', 'name')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel
      .findById(id)
      .populate('customerId', 'name')
      .populate('operatorId', 'name')
      .exec();

    if (!order) {
      throw new NotFoundException(`Order ${id} non trovato`);
    }

    return order;
  }

  async update(id: string, dto: UpdateOrderDto): Promise<Order> {
    const updated = await this.orderModel.findByIdAndUpdate(
      id,
      {
        ...dto,
        customerId: new Types.ObjectId(dto.customerId),
        operatorId: new Types.ObjectId(dto.operatorId),
        updatedAt: new Date()
      },
      { new: true },
    );

    if (!updated) {
      throw new NotFoundException(`Order ${id} non trovato`);
    }

    return updated;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.orderModel.findByIdAndDelete(id);
    if (!deleted) {
      throw new NotFoundException(`Order ${id} non trovato`);
    }
  }
}

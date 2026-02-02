import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderStateDto } from 'src/dto/order-state.dto';
import { OrderState, OrderStateDocument } from 'src/schemas/order-state.schema';
@Injectable()
export class OrderStateService {
  constructor(
    @InjectModel(OrderState.name) private OrderStateModel: Model<OrderStateDocument>,
  ) {}

  // Crea una nuova OrderState
  async create(OrderStateDto: OrderStateDto): Promise<OrderState> {
    const createdOrderState = new this.OrderStateModel({
      ...OrderStateDto,
      createdAt: new Date()
    }
  );

    return createdOrderState.save();
  }

  // Recupera tutte le OrderState
  async findAll(): Promise<OrderState[]> {
    return this.OrderStateModel.find().sort({ createdAt: -1 }).exec();
  }

  // Recupera una OrderState per ID
  async findOne(id: string): Promise<OrderState> {
    const o = await this.OrderStateModel.findById(id).exec();
    if (!o) {
      throw new NotFoundException(`Permissions con ID ${id} non trovato`);
    }
    return o;
  }

  // Aggiorna una OrderState per ID
  async update(id: string, OrderStateDto: OrderStateDto): Promise<OrderState> {
    const o = await this.OrderStateModel
      .findByIdAndUpdate(id, 
        {
          ...OrderStateDto,
          updatedAt: new Date()
        }, 
        { new: true })
      .exec();
    if (!o) {
      throw new NotFoundException(`OrderState con ID ${id} non trovato`);
    }
    return o;
  }

  // Rimuove una OrderState per ID
  async remove(id: string): Promise<boolean> {
    const o = await this.OrderStateModel.findByIdAndDelete(id).exec();
    if (!o)
      return false;
    
    return true;
  }
}

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderStateDocument = OrderState & Document;

@Schema()
export class OrderState {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  color: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;

}

export const OrderStateSchema = SchemaFactory.createForClass(OrderState);

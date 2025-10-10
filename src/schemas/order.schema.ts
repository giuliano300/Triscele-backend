import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Customer } from './customers.schema';
import { Operator } from './operators.schema';
import { OrderStatus, PaymentMethod } from 'src/enum/enum';
import { OrderProducts } from 'src/interfaces/orderProduct';
import { Sector } from './sector.schema';

export type OrderDocument = Order & Document;

@Schema()
export class Order {
  @Prop({ type: Types.ObjectId, ref: Customer.name, required: true })
  customerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Operator.name, required: true })
  operatorId: Types.ObjectId;

  @Prop({ required: true })
  status: OrderStatus;

  @Prop({ required: true })
  insertDate: Date;

  @Prop({ required: true })
  paymentMethod: PaymentMethod;

  @Prop({ required: true })
  expectedDelivery: Date;

  @Prop({ required: true })
  origin: string;

  @Prop({ required: true })
  agent: number;

  @Prop({ required: true })
  shippingAddress: string;

  @Prop({ required: true })
  shippingZipcode: string;

  @Prop({ required: true })
  shippingProvince: string;

  @Prop({ required: true })
  shippingCity: string;

  @Prop()
  shippingName: string;

  @Prop()
  shippingLastName: string;

  @Prop({ required: true })
  shippingBusinessName: string;

  @Prop({ required: true })
  shippingTelephone: string;

  @Prop({ required: true })
  shippingEmail: string;

  @Prop({ type: Types.ObjectId, ref: Sector.name, required: true })
  sectorId?: Types.ObjectId;

  @Prop()
  note: string;

  @Prop()
  customerNote?: string;

  @Prop({ required: true })
  orderProducts: OrderProducts[];

  @Prop({ required: true })
  totalPrice: number;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;

}

export const OrderSchema = SchemaFactory.createForClass(Order);

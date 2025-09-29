import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Customer } from './customers.schema';
import { Operator } from './operators.schema';
import { OrderStatus, PaymentMethod } from 'src/enum/enum';
import { OrderProducts } from 'src/interfaces/orderProduct';

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
  insertDate: string;

  @Prop({ required: true })
  paymentMethod: PaymentMethod;

  @Prop({ required: true })
  expectedDelivery: string;

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

  @Prop()
  note: string;

  @Prop({ required: true })
  orderProducts: OrderProducts[];


}

export const OrderSchema = SchemaFactory.createForClass(Order);

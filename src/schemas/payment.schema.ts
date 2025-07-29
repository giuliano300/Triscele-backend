import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Payment extends Document {
 @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true })
 bookingId: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, enum: ['PENDING', 'PAID', 'FAILED'], default: 'PENDING' })
  status: 'PENDING' | 'PAID' | 'FAILED';

  @Prop()
  method: string; // es: 'cash', 'card', 'paypal'

  @Prop()
  transactionId?: string;
}

export type PaymentDocument = Payment & Document;
export const PaymentSchema = SchemaFactory.createForClass(Payment);

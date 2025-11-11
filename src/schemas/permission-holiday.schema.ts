import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Operator } from './operators.schema';

export type PermissionHolidayDocument = PermissionHoliday & Document;

@Schema({ timestamps: true })
export class PermissionHoliday {
  @Prop({ required: true })
  type: number;

  @Prop({ required: true, type: Types.ObjectId, ref: Operator.name })
  operatorId: Types.ObjectId;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop()
  startHour?: string; // "HH:mm:ss"

  @Prop()
  endHour?: string;

  @Prop()
  reason?: string;

  @Prop()
  accepted?: boolean;

  @Prop({ default: false })
  read: boolean;

  @Prop()
  rejectedReason?: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;

}

export const PermissionHolidaySchema = SchemaFactory.createForClass(PermissionHoliday);

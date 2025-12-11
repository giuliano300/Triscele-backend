import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Operator } from './operators.schema';

export type AttendanceDocument = Attendance & Document;

@Schema({ timestamps: true })
export class Attendance {
  @Prop({ required: true, type: Types.ObjectId, ref: Operator.name })
  operatorId: Types.ObjectId;

  @Prop({ required: true })
  date: Date;

// 👉 ORARI REALI
  @Prop({ required: true })
  entryTime: string; // "HH:mm:ss"

  @Prop()
  exitTime?: string; // "HH:mm:ss"

  // 👉 PAUSA PRANZO REALE
  @Prop()
  lunchStart?: string; // "HH:mm:ss"

  @Prop()
  lunchEnd?: string; // "HH:mm:ss"
  
  @Prop()
  notes?: string;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);

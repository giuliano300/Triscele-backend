import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Operator } from './operators.schema';

export type AttendanceDocument = Attendance & Document;

interface Break {
  start: string;
  end?: string;
}


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
  breaks: Break[];
  
  @Prop()
  notes?: string;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);

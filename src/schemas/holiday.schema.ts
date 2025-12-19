import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HolidayDocument = Holiday & Document;

@Schema()
export class Holiday {

  @Prop({ required: true })
  date: string; // YYYY-MM-DD

  @Prop({ required: true })
  description: string;

}

export const HolidaySchema = SchemaFactory.createForClass(Holiday);

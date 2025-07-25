import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SpaceDocument = Space & Document;

@Schema()
export class Space {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  hourlyRate: number;

  @Prop({ default: true })
  isAvailable: boolean;
}

export const SpaceSchema = SchemaFactory.createForClass(Space);

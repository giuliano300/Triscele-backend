import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SectorDocument = Sector & Document;


@Schema()
export class Sector {
  @Prop({ required: true, unique: true })
  name: string;

   @Prop()
  description?: string;
}

export const SectorSchema = SchemaFactory.createForClass(Sector);

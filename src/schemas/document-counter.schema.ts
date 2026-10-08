import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DocumentCounterDocument = DocumentCounter & Document;

@Schema({ collection: 'documentCounters' })
export class DocumentCounter {
  @Prop({ required: true, unique: true })
  key: string;

  @Prop({ required: true, default: 0 })
  sequence: number;
}

export const DocumentCounterSchema = SchemaFactory.createForClass(DocumentCounter);

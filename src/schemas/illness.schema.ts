import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Operator } from './operators.schema';

export type IllnessDocument = Illness & Document;

@Schema()
export class Illness {
  @Prop({ required: true, unique: true })
  protocol: string;

  @Prop({ required: true, type: Types.ObjectId, ref: Operator.name })
  operatorId: Types.ObjectId;

  @Prop()
  start?: Date;

  @Prop()
  end?: Date;

  @Prop()
  read?: boolean;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;

}

export const IllnessSchema = SchemaFactory.createForClass(Illness);

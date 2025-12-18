import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class AllowedIp extends Document {

  @Prop({ required: true, unique: true })
  ip: string;

  @Prop()
  description?: string;
}

export const AllowedIpSchema = SchemaFactory.createForClass(AllowedIp);

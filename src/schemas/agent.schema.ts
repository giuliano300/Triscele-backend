import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AgentDocument = Agent & Document;

@Schema()
export class Agent {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  email: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;

}

export const AgentSchema = SchemaFactory.createForClass(Agent);

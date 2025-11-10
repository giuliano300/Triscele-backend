import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CustomerDocument = Customer & Document;

@Schema()
export class Customer {
  @Prop({ required: true })
  businessName: string;

  @Prop()
  name: string;
  
  @Prop()
  lastName: string;
  
  @Prop()
  birthDate: string;
  
  @Prop()
  mobile: string;

  @Prop()
  customerNote?: string;
 
  @Prop()
  sdi: string;
 
  @Prop()
  status: string;
 
  @Prop()
  pwd: string;
 
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
   vatNumber: string;

  @Prop()
  agentName: string;

  @Prop({ required: true })
  address: string;

  @Prop()
  zipCode: string;

  @Prop({ required: true })
  province: string;

  @Prop({ required: true })
  city: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);

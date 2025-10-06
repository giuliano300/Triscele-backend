import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SupplierDocument = Supplier & Document;

@Schema()
export class Supplier {
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
  sdi: string;
 
  @Prop({ required: true })
  status: string;
 
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

  @Prop({ required: true })
  pwd: string;
  
  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;

}

export const SupplierSchema = SchemaFactory.createForClass(Supplier);

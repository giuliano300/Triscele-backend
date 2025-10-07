import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OperatorDocument = Operator & Document;

class PermissionEmbedded {
  @Prop({ required: true })
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  permissionName: string;
}

@Schema()
export class Operator {

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
  
  @Prop({ required: true })
  status: string;
 
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  fiscalCode: string;

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
  gender: string;
  
  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;

  @Prop({ type: [PermissionEmbedded], default: [] })
  permissions: PermissionEmbedded[];

}

export const OperatorSchema = SchemaFactory.createForClass(Operator);

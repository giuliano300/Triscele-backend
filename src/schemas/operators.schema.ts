import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Sector } from './sector.schema';
import { LoginType } from 'src/enum/enum';

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
  loginType: LoginType;

  @Prop()
  businessName: string;
 
  @Prop({ required: true })
  name: string;
  
  @Prop({ required: true })
  lastName: string;
  
  @Prop({ required: true })
  status: string;
 
  @Prop({ required: true })
  email: string;

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

  @Prop({ type: Types.ObjectId, ref: Sector.name, required: true })
  sectorId?: Types.ObjectId;
  
  @Prop()
  gender: string;
  
  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;

  @Prop({ type: [PermissionEmbedded], default: [] })
  permissions: PermissionEmbedded[];


  // ORARI TEORICI (per valutare ritardi, pause, ecc.)

  @Prop({ required: true })
  startTime: string;       // es. "08:30:00"

  @Prop({ required: true })
  endTime: string;         // es. "17:30:00"

  @Prop({ required: true })
  numberOfHolidays: number = 0;

  @Prop({ required: true })
  numberOfPermissions: number = 0;

  @Prop({ required: true })
  remainingNumberOfHolidays: number = 0;

  @Prop({ required: true })
  remainingNumberOfPermissions: number = 0;
}

export const OperatorSchema = SchemaFactory.createForClass(Operator);

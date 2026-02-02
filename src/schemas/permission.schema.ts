import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PermissionDocument = Permission & Document;

@Schema()
export class Permission {
  @Prop({ required: true, unique: true })
  name: string;
  
  @Prop()
  permissionName: string;
  
  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);

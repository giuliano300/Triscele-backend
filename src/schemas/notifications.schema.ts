/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserRole } from 'src/enum/enum';

export type NotificationDocument = Notifications & Document;

@Schema({ timestamps: true })
export class Notifications {
  @Prop({ required: false })  // opzionale, perché admin userId = null
  userId?: string;

  @Prop({ required: true, enum: UserRole, index: true })
  userRole: UserRole;

  @Prop({ required: true })
  event: string;

  @Prop({ type: Object })
  payload: any;

  @Prop({ default: false })
  read: boolean;

   _id: Types.ObjectId;
}

export const NotificationSchema = SchemaFactory.createForClass(Notifications);

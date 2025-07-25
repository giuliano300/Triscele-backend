import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole } from 'src/roles/roles.decorator';

export type UserDocument = User & Document;


@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

 @Prop({ required: true, enum: ['admin', 'gestore', 'cliente'], default: 'cliente' })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);

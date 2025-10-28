import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ProductUpDto } from 'src/dto/productUp.dto';

export type OptionsDocument = Options & Document;

@Schema()
export class Options {
  
  @Prop({ required: true })
  name: string;
  
  @Prop()
  products: ProductUpDto[]

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;

}

export const OptionsSchema = SchemaFactory.createForClass(Options);

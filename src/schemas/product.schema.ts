import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  internalCode: string;

  @Prop({ required: true })
  categoryId: string;

  @Prop({ required: true })
  theshold: number;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  cost: number;

  @Prop({ required: true })
  enabled: boolean;

  @Prop({ required: true })
  stock_type: string;

  @Prop({ required: true })
  supplierCode: string;

  @Prop({ required: true })
  supplierId: string;

  @Prop()
  description: string;

  @Prop()
  files: string[];

  @Prop()
  amazonCode: string;

  @Prop()
  ebayCode: string;

  @Prop()
  wcCode: string;

  @Prop()
  manomanoCode: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Category } from './category.schema';
import { Supplier } from './suppliers.schema';
import { SubProducts } from 'src/interfaces/subProduct';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  internalCode: string;

  // cambio da string a ObjectId con ref
  @Prop({ type: Types.ObjectId, ref: Category.name, required: true })
  categoryId: Types.ObjectId;

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

  // cambio da string a ObjectId con ref
  @Prop({ type: Types.ObjectId, ref: Supplier.name, required: true })
  supplierId: Types.ObjectId;

  @Prop()
  description: string;

  @Prop()
  files: unknown[];

  @Prop()
  amazonCode: string;

  @Prop()
  ebayCode: string;

  @Prop()
  wcCode: string;

  @Prop()
  manomanoCode: string;
  
  @Prop()
  subProducts: SubProducts[];
  
  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;

  @Prop({ required: true })
  stock: number;

}

export const ProductSchema = SchemaFactory.createForClass(Product);

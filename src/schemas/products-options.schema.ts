import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ProductUpDto } from 'src/dto/productUp.dto';

export type ProductsOptionsDocument = ProductsOptions & Document;

@Schema()
export class ProductsOptions {
  
  @Prop({ required: true })
  name: string;
  
  @Prop()
  products: ProductUpDto[]

  @Prop()
  parentId?: string;

  @Prop()
  parentProductId?: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;

}

export const ProductsOptionsSchema = SchemaFactory.createForClass(ProductsOptions);

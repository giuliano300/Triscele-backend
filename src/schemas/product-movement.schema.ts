import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Product } from './product.schema';

export type ProductMovementsDocument = ProductMovements & Document;

@Schema()
export class ProductMovements {
  
  @Prop({ required: true })
  movementType: string;
  
  @Prop({ required: true })
  stock: string;

  @Prop({ type: Types.ObjectId, ref: Product.name, required: true })
  productId: Types.ObjectId;

  @Prop({ required: true })
  createdAt: Date;

}

export const ProductMovementSchema = SchemaFactory.createForClass(ProductMovements);

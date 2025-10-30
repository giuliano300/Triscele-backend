import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString } from 'class-validator';
import mongoose, { Document } from 'mongoose';
import { ProductUpDto } from 'src/dto/productUp.dto';
import { OptionType } from 'src/enum/enum';

export type ProductsOptionsDocument = ProductsOptions & Document;

@Schema()
export class ProductsOptions {
  
  @Prop({ required: true })
  name: string;

  @IsString()
  layer: string;
  
  @Prop({ required: true })
  optionType: OptionType;
  
  @Prop()
  products: ProductUpDto[]

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'ProductsOptions' })
  parent?: ProductsOptions;

  @Prop()
  parentProduct?: ProductUpDto;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;

}

export const ProductsOptionsSchema = SchemaFactory.createForClass(ProductsOptions);

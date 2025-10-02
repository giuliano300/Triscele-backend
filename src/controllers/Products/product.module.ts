import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/schemas/product.schema';
import { ProductService } from 'src/services/product.service';
import { ProductController } from './product.controller';
import { ProductMovements, ProductMovementSchema } from 'src/schemas/product-movement.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Product.name, schema: ProductSchema },
    { name: ProductMovements.name, schema: ProductMovementSchema }
  ])],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}

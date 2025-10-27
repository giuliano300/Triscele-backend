import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/schemas/product.schema';
import { ProductsOptionsService } from 'src/services/products-options.service';
import { ProductsOptionsController } from './productsOptions.controller';
import { ProductsOptions, ProductsOptionsSchema } from 'src/schemas/products-options.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: ProductsOptions.name, schema: ProductsOptionsSchema }, { name: Product.name, schema: ProductSchema }])],
  providers: [ProductsOptionsService],
  controllers: [ProductsOptionsController],
})
export class ProductsOptionsModule {}

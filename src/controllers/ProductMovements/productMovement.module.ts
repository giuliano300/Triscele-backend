import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductMovementService } from 'src/services/product-movement.service';
import { ProductMovements, ProductMovementSchema } from 'src/schemas/product-movement.schema';
import { ProductMovementsController } from './productMovement.controller';
import { Product, ProductSchema } from 'src/schemas/product.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: ProductMovements.name, schema: ProductMovementSchema }, { name: Product.name, schema: ProductSchema }])],
  providers: [ProductMovementService],
  controllers: [ProductMovementsController],
})
export class ProductMovementModule {}

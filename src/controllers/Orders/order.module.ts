import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderController } from './order.controller';
import { Order, OrderSchema } from 'src/schemas/order.schema';
import { OrderService } from 'src/services/order.service';
import { Product, ProductSchema } from 'src/schemas/product.schema';
import { Operator, OperatorSchema } from 'src/schemas/operators.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: Operator.name, schema: OperatorSchema }])
  ],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderController } from './order.controller';
import { Order, OrderSchema } from 'src/schemas/order.schema';
import { OrderService } from 'src/services/order.service';
import { Product, ProductSchema } from 'src/schemas/product.schema';
import { Operator, OperatorSchema } from 'src/schemas/operators.schema';
import { OrderState, OrderStateSchema } from 'src/schemas/order-state.schema';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { Customer, CustomerSchema } from 'src/schemas/customers.schema';

@Module({
  imports: [
    NotificationsModule,
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    MongooseModule.forFeature([{ name: Customer.name, schema: CustomerSchema }]),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: Operator.name, schema: OperatorSchema }]),
    MongooseModule.forFeature([{ name: OrderState.name, schema: OrderStateSchema }])
  ],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}

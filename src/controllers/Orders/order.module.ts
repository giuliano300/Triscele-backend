import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderController } from './order.controller';
import { Order, OrderSchema } from 'src/schemas/order.schema';
import { OrderService } from 'src/services/order.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }])],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}

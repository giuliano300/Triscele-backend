import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderState, OrderStateSchema } from 'src/schemas/order-state.schema';
import { OrderStateController } from './order-state.controller';
import { OrderStateService } from 'src/services/order-state.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: OrderState.name, schema: OrderStateSchema }]),
  ],
  controllers: [OrderStateController],
  providers: [OrderStateService],
})
export class OrderStateModule {}

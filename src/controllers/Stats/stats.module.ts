import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StatsController } from './stats.controller';
import { StatsService } from '../../services/stat.service';
import { Order, OrderSchema } from '../../schemas/order.schema';
import { Customer, CustomerSchema } from '../../schemas/customers.schema';
import { Agent, AgentSchema } from '../../schemas/agent.schema';
import { OrderState, OrderStateSchema } from '../../schemas/order-state.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Customer.name, schema: CustomerSchema },
      { name: Agent.name, schema: AgentSchema },
      { name: OrderState.name, schema: OrderStateSchema },
    ]),
  ],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}

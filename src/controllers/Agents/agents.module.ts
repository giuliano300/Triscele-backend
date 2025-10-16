import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Agent, AgentSchema } from 'src/schemas/agent.schema';
import { AgentController } from './agents.controller';
import { AgentsService } from 'src/services/agents.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Agent.name, schema: AgentSchema }]),
  ],
  controllers: [AgentController],
  providers: [AgentsService],
})
export class AgentModule {}

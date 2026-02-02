import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { AgentDto } from 'src/dto/agent.dto';
import { Agent } from 'src/schemas/agent.schema';
import { AgentsService } from 'src/services/agents.service';

@Controller('Agents')
export class AgentController {
  constructor(private readonly AgentService: AgentsService) {}

  @Post()
  async create(@Body() AgentDto: AgentDto): Promise<Agent> {
    return this.AgentService.create(AgentDto);
  }
  
  @Get()
  async findAll(): Promise<Agent[]> {
    return this.AgentService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Agent> {
    return this.AgentService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() AgentDto: AgentDto
  ): Promise<Agent> {
    return this.AgentService.update(id, AgentDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<boolean> {
    return this.AgentService.remove(id);
  }

}

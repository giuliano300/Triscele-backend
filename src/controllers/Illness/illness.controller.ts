import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { IllnessDto } from 'src/dto/illness.dto';
import { Illness } from 'src/schemas/illness.schema';
import { IllnessService } from 'src/services/illness.service';

@Controller('illness')
export class IllnessController {
  constructor(private readonly IllnessService: IllnessService) {}

  @Post()
  async create(@Body() IllnessDto: IllnessDto): Promise<Illness> {
    return this.IllnessService.create(IllnessDto);
  }
  
  @Get()
  async findAll(@Query('operatorId') operatorId?: string): Promise<Illness[]> {
    return this.IllnessService.findAll(operatorId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Illness> {
    return this.IllnessService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() IllnessDto: IllnessDto
  ): Promise<Illness> {
    return this.IllnessService.update(id, IllnessDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<boolean> {
    return this.IllnessService.remove(id);
  }

}

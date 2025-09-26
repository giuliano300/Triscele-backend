import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { CreateOperatorDto } from 'src/dto/create-operator.dto';
import { UpdateOperatorDto } from 'src/dto/update-operator.dto';
import { Operator } from 'src/schemas/operators.schema';
import { OperatorService } from 'src/services/operators.service';


@Controller('Operators')
export class OperatorController {
  constructor(private readonly OperatorService: OperatorService) {}

  @Post()
  async create(@Body() createOperatorDto: CreateOperatorDto): Promise<Operator> {
    return this.OperatorService.create(createOperatorDto);
  }

  @Get()
  async findAll(): Promise<Operator[]> {
    return this.OperatorService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Operator> {
    return this.OperatorService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOperatorDto: UpdateOperatorDto
  ): Promise<Operator> {
    return this.OperatorService.update(id, updateOperatorDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Operator> {
    return this.OperatorService.remove(id);
  }
}

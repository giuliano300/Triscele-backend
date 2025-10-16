import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { OrderStateDto } from 'src/dto/order-state.dto';
import { OrderState } from 'src/schemas/order-state.schema';
import { OrderStateService } from 'src/services/order-state.service';

@Controller('order-state')
export class OrderStateController {
  constructor(private readonly OrderStateService: OrderStateService) {}

  @Post()
  async create(@Body() OrderStateDto: OrderStateDto): Promise<OrderState> {
    return this.OrderStateService.create(OrderStateDto);
  }
  
  @Get()
  async findAll(): Promise<OrderState[]> {
    return this.OrderStateService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<OrderState> {
    return this.OrderStateService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() OrderStateDto: OrderStateDto
  ): Promise<OrderState> {
    return this.OrderStateService.update(id, OrderStateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<boolean> {
    return this.OrderStateService.remove(id);
  }

}

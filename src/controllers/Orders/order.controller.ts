import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { CreateOrderDto, UpdateOrderDto } from 'src/dto/order.dto';
import { Order } from 'src/schemas/order.schema';
import { OrderService } from 'src/services/order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() dto: CreateOrderDto): Promise<Order> {
    return this.orderService.create(dto);
  }

  @Get()
  findAll(): Promise<Order[]> {
    return this.orderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Order> {
    return this.orderService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateOrderDto): Promise<Order> {
    return this.orderService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.orderService.remove(id);
  }
}

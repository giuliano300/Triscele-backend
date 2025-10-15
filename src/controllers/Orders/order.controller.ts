/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
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
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 20,    
    @Query('customerId') customerId?: string,
    @Query('operatorId') operatorId?: string,
    @Query('sectorId') sectorId?: string,
    @Query('status') status?: string,
    @Query('start') start?: string,
    @Query('end') end?: string,
    @Query('admin') admin?: string,
  ): Promise<{
    data: Order[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> 
  {   
    return this.orderService.findAll(+page, +limit, customerId, operatorId, sectorId, status, start, end, admin);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Order> {
    return this.orderService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateOrderDto,
    @Query('operatorId') operatorId?: string
  ): Promise<Order> {
    return this.orderService.update(id, dto, operatorId);
  }

  @Post('convertToOrder')
  convertToOrder( @Body() dto: any): Promise<Order> {
    return this.orderService.convertToOrder(dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<boolean> {
    return this.orderService.remove(id);
  }
}

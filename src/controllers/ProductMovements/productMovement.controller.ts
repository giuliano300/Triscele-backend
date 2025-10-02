import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ProductMovementsDto } from 'src/dto/product-movement.dto';
import { ProductMovements } from 'src/schemas/product-movement.schema';
import { ProductMovementService } from 'src/services/product-movement.service';

@Controller('productMovements')
export class ProductMovementsController {
  constructor(private readonly productMovementService: ProductMovementService) {}

  @Post()
  create(@Body() dto: ProductMovementsDto): Promise<ProductMovements> {
    return this.productMovementService.create(dto);
  }

  @Get()
  findAll(): Promise<ProductMovements[]> {
    return this.productMovementService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ProductMovements> {
    return this.productMovementService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: ProductMovementsDto): Promise<ProductMovements> {
    return this.productMovementService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<boolean> {
    return this.productMovementService.remove(id);
  }
}

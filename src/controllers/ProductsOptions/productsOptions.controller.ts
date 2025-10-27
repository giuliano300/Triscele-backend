import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { CreateProductsOptionsDto } from 'src/dto/create-products-options.dto';
import { UpdateProductsOptionsDto } from 'src/dto/update-products-options.dto';
import { ProductsOptions } from 'src/schemas/products-options.schema';
import { ProductsOptionsService } from 'src/services/products-options.service';

@Controller('productsOptions')
export class ProductsOptionsController {
  constructor(private readonly productsOptionsService: ProductsOptionsService) {}

  @Post()
  create(@Body() dto: CreateProductsOptionsDto): Promise<ProductsOptions> {
    return this.productsOptionsService.create(dto);
  }

  @Get()
  findAll(): Promise<ProductsOptions[]> {
    return this.productsOptionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ProductsOptions> {
    return this.productsOptionsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductsOptionsDto): Promise<boolean> {
    return this.productsOptionsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<boolean> {
    return this.productsOptionsService.remove(id);
  }
}

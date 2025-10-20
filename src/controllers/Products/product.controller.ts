/* eslint-disable @typescript-eslint/no-explicit-any */
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from 'src/dto/product.dto';
import { Product } from 'src/schemas/product.schema';
import { ProductService } from 'src/services/product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() dto: CreateProductDto): Promise<Product> {
    return this.productService.create(dto);
  }

  @Get()
  async getAll(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('categoryId') categoryId?: string,
    @Query('supplierId') supplierId?: string,
    @Query('name') name?: string,
    @Query('sortField') sortField?: string,
    @Query('sortDirection') sortDirection?: string
  ) 
  {
    const direction = sortDirection === 'asc' || sortDirection === 'desc' ? sortDirection : 'desc';

    return this.productService.findAll(+page, +limit, categoryId, supplierId, name, sortField, direction);
  }  

  @Get('findLowStock')
  findLowStock(): Promise<unknown> {
    return this.productService.findLowStock();
  }

  @Get('findProductsForSelect')
  findProductsForSelect(): Promise<unknown> {
    return this.productService.findProductsForSelect();
  }

  @Get('findProductsByName')
  async getProductsByName(@Query('name') name: string): Promise<any[]> {
    // blocca se meno di 2 caratteri
    if (!name || name.trim().length < 2) {
      return [];
    }
    return this.productService.getProductsByName(name);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<unknown> {
    return this.productService.findOne(id);
  }

  @Post(':id/duplicate')
  async duplicate(@Param('id') id: string): Promise<unknown> {
    return this.productService.duplicate(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto): Promise<Product> {
    return this.productService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<boolean> {
    return this.productService.remove(id);
  }
}

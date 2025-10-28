import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { CreateOptionsDto } from 'src/dto/create-options.dto';
import { UpdateProductsOptionsDto } from 'src/dto/update-products-options.dto';
import { ProductsOptions } from 'src/schemas/products-options.schema';
import { OptionsService } from 'src/services/options.service';

@Controller('options')
export class OptionsController {
  constructor(private readonly optionsService: OptionsService) {}

  @Post()
  create(@Body() dto: CreateOptionsDto): Promise<ProductsOptions> {
    return this.optionsService.create(dto);
  }

  @Get()
  findAll(): Promise<ProductsOptions[]> {
    return this.optionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ProductsOptions> {
    return this.optionsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductsOptionsDto): Promise<boolean> {
    return this.optionsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<boolean> {
    return this.optionsService.remove(id);
  }
}

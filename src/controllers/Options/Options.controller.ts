import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { CreateOptionsDto } from 'src/dto/create-options.dto';
import { UpdateProductsOptionsDto } from 'src/dto/update-products-options.dto';
import { Options } from 'src/schemas/options.schema';
import { OptionsService } from 'src/services/options.service';

@Controller('options')
export class OptionsController {
  constructor(private readonly optionsService: OptionsService) {}

  @Post()
  create(@Body() dto: CreateOptionsDto): Promise<Options> {
    return this.optionsService.create(dto);
  }

  @Get()
  findAll(): Promise<Options[]> {
    return this.optionsService.findAll();
  }

    @Get('search')
    search(@Query('name') name: string) {
      return this.optionsService.searchByName(name);
    }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Options> {
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

    @Post(':id/duplicate')
    async duplicate(@Param('id') id: string): Promise<unknown> {
      return this.optionsService.duplicate(id);
    }
}

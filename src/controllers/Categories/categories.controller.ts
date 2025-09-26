import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CategoryDto } from 'src/dto/category.dto';
import { Category } from 'src/schemas/category.schema';
import { CategoriesService } from 'src/services/categories.service';

@Controller('Categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoriesService) {}

  @Post()
  async create(@Body() categoryDto: CategoryDto): Promise<Category> {
    return this.categoryService.create(categoryDto);
  }
  
  @Get()
  async findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Category> {
    return this.categoryService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() categoryDto: CategoryDto
  ): Promise<Category> {
    return this.categoryService.update(id, categoryDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Category> {
    return this.categoryService.remove(id);
  }

}

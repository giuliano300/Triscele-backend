import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { CreateSupplierDto } from 'src/dto/create-supplier.dto';
import { UpdateSupplierDto } from 'src/dto/update-supplier.dto';
import { Supplier } from 'src/schemas/suppliers.schema';
import { SupplierService } from 'src/services/suppliers.service';

@Controller('Suppliers')
export class SupplierController {
  constructor(private readonly SupplierService: SupplierService) {}

  @Post()
  async create(@Body() createSupplierDto: CreateSupplierDto): Promise<Supplier> {
    return this.SupplierService.create(createSupplierDto);
  }

  @Get()
  async findAll(): Promise<Supplier[]> {
    return this.SupplierService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Supplier> {
    return this.SupplierService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSupplierDto: UpdateSupplierDto
  ): Promise<Supplier> {
    return this.SupplierService.update(id, updateSupplierDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Supplier> {
    return this.SupplierService.remove(id);
  }
}

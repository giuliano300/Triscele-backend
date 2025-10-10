import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { SectorDto } from 'src/dto/sector.dto';
import { Sector } from 'src/schemas/sector.schema';
import { SectorsService } from 'src/services/sectors.service';

@Controller('Sectors')
export class SectorController {
  constructor(private readonly SectorService: SectorsService) {}

  @Post()
  async create(@Body() createSectorDto: SectorDto): Promise<Sector> {
    return this.SectorService.create(createSectorDto);
  }

  @Get()
  async findAll(): Promise<Sector[]> {
    return this.SectorService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Sector> {
    return this.SectorService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSectorDto: SectorDto
  ): Promise<Sector> {
    return this.SectorService.update(id, updateSectorDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Sector> {
    return this.SectorService.remove(id);
  }
}

import { Body, Controller, Delete, Get, Param, Post, Put, HttpException, HttpStatus, Query } from '@nestjs/common';
import { PermissionHolidayDto } from 'src/dto/permission-holiday.dto';
import { PermissionHolidayService } from 'src/services/permission-holiday.service';

@Controller('permission-holiday')
export class PermissionHolidayController {
  constructor(private readonly permissionHolidayService: PermissionHolidayService) {}

  @Post()
  async create(@Body() dto: PermissionHolidayDto) {
    try {
      return await this.permissionHolidayService.create(dto);
    } catch (error) {
      throw new HttpException(
        `Errore durante la creazione: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async findAll(@Query('operatorId') operatorId?: string) {
    return this.permissionHolidayService.findAll(operatorId);
  }

  @Get('count-pending')
  async countPending(@Query('operatorId') operatorId?: string) {
    return this.permissionHolidayService.countPending(operatorId);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const item = await this.permissionHolidayService.findById(id);
    if (!item) {
      throw new HttpException('Permesso non trovato', HttpStatus.NOT_FOUND);
    }
    return item;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: PermissionHolidayDto) {
    const updated = await this.permissionHolidayService.update(id, dto);
    if (!updated) {
      throw new HttpException('Permesso non trovato o non aggiornato', HttpStatus.NOT_FOUND);
    }
    return updated;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const deleted = await this.permissionHolidayService.delete(id);
    if (!deleted) {
      throw new HttpException('Permesso non trovato o già eliminato', HttpStatus.NOT_FOUND);
    }
    return { message: 'Permesso eliminato con successo' };
  }
}

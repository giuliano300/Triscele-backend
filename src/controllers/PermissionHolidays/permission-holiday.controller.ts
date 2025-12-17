/* eslint-disable @typescript-eslint/no-explicit-any */
import { Body, Controller, Delete, Get, Param, Post, Put, HttpException, HttpStatus, Query } from '@nestjs/common';
import { PermissionHolidayDto } from 'src/dto/permission-holiday.dto';
import { OperatorService } from 'src/services/operators.service';
import { PermissionHolidayService } from 'src/services/permission-holiday.service';

@Controller('permission-holiday')
export class PermissionHolidayController {
  constructor(private readonly permissionHolidayService: PermissionHolidayService, private readonly operatorService: OperatorService) {}

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

  @Put('approveOrNotPermissionHoliday/:id')
  async approveOrNotPermissionHoliday(
    @Param('id') id: string,
    @Body() dto: PermissionHolidayDto
  ): Promise<any> {

    // Se la richiesta non è accettata, aggiorna solo il DTO
    if (!dto.accepted) {
      const updated = await this.permissionHolidayService.update(id, dto);
      return updated 
        ? { success: true, msg: 'Aggiornamento completato' }
        : { success: false, msg: 'Errore nell\'aggiornamento' };
    }

    const operator = await this.operatorService.find(dto.operatorId);
    if (!operator) {
      return { success: false, msg: 'Non esiste l\'operatore' };
    }

    let amountToDeduct: number;

    if (dto.type === 1) {
      // FERIE
      const start = new Date(dto.startDate);
      const end = new Date(dto.endDate);
      amountToDeduct = this.countWorkingDays(start, end);

      if (operator.remainingNumberOfHolidays < amountToDeduct) {
        return { success: false, msg: 'Giorni di ferie insufficienti' };
      }

      await this.operatorService.deductHolidays(operator.id, amountToDeduct);

    } 
    else 
    {
      // PERMESSI ORARI
      const [startH, startM] = dto.startHour!.split(':').map(Number);
      const [endH, endM] = dto.endHour!.split(':').map(Number);

      const startDate = new Date();
      startDate.setHours(startH, startM, 0, 0);

      const endDate = new Date();
      endDate.setHours(endH, endM, 0, 0);

      amountToDeduct = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60); // ore decimali

      if (operator.remainingNumberOfPermissions < amountToDeduct) {
        return { success: false, msg: 'Ore di permesso insufficienti' };
      }

      await this.operatorService.deductPermissions(operator.id, amountToDeduct);
    }

    // Aggiorna la richiesta
    const updated = await this.permissionHolidayService.update(id, dto);
    return updated
      ? { success: true, msg: 'Aggiornamento completato' }
      : { success: false, msg: 'Errore nell\'aggiornamento' };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const deleted = await this.permissionHolidayService.delete(id);
    if (!deleted) {
      throw new HttpException('Permesso non trovato o già eliminato', HttpStatus.NOT_FOUND);
    }
    return { message: 'Permesso eliminato con successo' };
  }


  private getItalianHolidays(startYear: number, endYear: number): Set<string> {
    const holidays = new Set<string>();

    for (let year = startYear; year <= endYear; year++) {
      // Festività fisse
      [
        `${year}-01-01`,
        `${year}-01-06`,
        `${year}-04-25`,
        `${year}-05-01`,
        `${year}-06-02`,
        `${year}-08-15`,
        `${year}-11-01`,
        `${year}-12-08`,
        `${year}-12-25`,
        `${year}-12-26`,
      ].forEach(d => holidays.add(d));

      // Pasqua
      const easter = this.getEasterDate(year);
      const easterStr = easter.toISOString().split('T')[0];
      holidays.add(easterStr);

      // Pasquetta (Lunedì dell'Angelo)
      const easterMonday = new Date(easter);
      easterMonday.setDate(easterMonday.getDate() + 1);
      const easterMondayStr = easterMonday.toISOString().split('T')[0];
      holidays.add(easterMondayStr);
    }

    return holidays;
  }

  private countWorkingDays(start: Date, end: Date): number {
    const holidays = this.getItalianHolidays(start.getFullYear(), end.getFullYear());
    let count = 0;

    const current = new Date(start);
    current.setHours(0, 0, 0, 0);

    const last = new Date(end);
    last.setHours(0, 0, 0, 0);

    while (current <= last) {
      const day = current.getDay(); // 0=Dom, 6=Sab
      const dateStr = current.toISOString().split('T')[0];

      const isWeekend = day === 0 || day === 6;
      const isHoliday = holidays.has(dateStr);

      if (!isWeekend && !isHoliday) {
        count++;
      }

      current.setDate(current.getDate() + 1);
    }

    return count;
  }


  private getEasterDate(year: number): Date {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31); // 3=Marzo, 4=Aprile
    const day = ((h + l - 7 * m + 114) % 31) + 1;

    return new Date(year, month - 1, day);
  }


}

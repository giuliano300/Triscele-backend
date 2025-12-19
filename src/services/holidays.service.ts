/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateHolidayDto } from 'src/dto/create-holiday.dto';
import { Holiday, HolidayDocument } from 'src/schemas/holiday.schema';

@Injectable()
export class HolidaysService {

  constructor(
    @InjectModel(Holiday.name)
    private readonly holidayModel: Model<HolidayDocument>
  ) {}

  // -----------------------
  // FESTIVI ITALIANI
  // -----------------------
  getItalianHolidays(year: number): string[] {

    const holidays: string[] = [];

    const fixed = [
      `${year}-01-01`,
      `${year}-01-06`,
      `${year}-05-01`,
      `${year}-06-02`,
      `${year}-08-15`,
      `${year}-11-01`,
      `${year}-12-08`,
      `${year}-12-25`,
      `${year}-12-26`
    ];

    holidays.push(...fixed);

    // Pasqua (Meeus)
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
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;

    const easter = new Date(year, month - 1, day);
    holidays.push(easter.toISOString().split('T')[0]);

    const easterMonday = new Date(easter);
    easterMonday.setDate(easter.getDate() + 1);
    holidays.push(easterMonday.toISOString().split('T')[0]);

    return holidays;
  }

  // -----------------------
  // CRUD GIORNI VESTIVI
  // -----------------------
  async createCustomHoliday(dto: any) {
    return this.holidayModel.create(dto);
  }

  async getCustomHolidays(year: number): Promise<string[]> {
    const start = `${year}-01-01`;
    const end = `${year}-12-31`;

    const days = await this.holidayModel.find({
      date: { $gte: start, $lte: end }
    });

    return days.map(d => d.date);
  }

    async getAllCustomHolidays(year?: number): Promise<Holiday[]> {

    const filter: any = {
      
    };

    if (year) {
      filter.date = {
        $gte: `${year}-01-01`,
        $lte: `${year}-12-31`
      };
    }

    const days = await this.holidayModel.find(filter);

    return days;
  }



  // -----------------------
  // UNIONE FINALE
  // -----------------------
  async getAllHolidays(year: number): Promise<string[]> {

    const italian = this.getItalianHolidays(year);
    const custom = await this.getCustomHolidays(year);

    return Array.from(new Set([...italian, ...custom])).sort();
  }


  // Aggiorna una Holiday per ID
  async update(id: string, holidayDto: CreateHolidayDto): Promise<Holiday> {
    const cat = await this.holidayModel
      .findByIdAndUpdate(id, 
        {
          ...holidayDto,
          updatedAt: new Date()
        }, 
        { new: true })
      .exec();
    if (!cat) {
      throw new NotFoundException(`Holiday con ID ${id} non trovato`);
    }
    return cat;
  }

  // Rimuove una Holiday per ID
  async remove(id: string): Promise<boolean> {
    const cat = await this.holidayModel.findByIdAndDelete(id).exec();
    if (!cat)
      return false;
    
    return true;
  }
}

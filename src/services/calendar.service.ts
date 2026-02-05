/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Attendance, AttendanceDocument } from 'src/schemas/attendance.schema';
import { PermissionHoliday, PermissionHolidayDocument } from 'src/schemas/permission-holiday.schema';
import { Illness, IllnessDocument } from 'src/schemas/illness.schema';

export enum EventType {
  PRESENCE = 'presence',
  ABSENCE = 'absence',
  ILLNESS = 'illness'
}

@Injectable()
export class CalendarService {
  constructor(
    @InjectModel(Attendance.name) private readonly attendanceModel: Model<AttendanceDocument>,
    @InjectModel(PermissionHoliday.name) private readonly permissionHolidayModel: Model<PermissionHolidayDocument>,
    @InjectModel(Illness.name) private readonly illnessModel: Model<IllnessDocument>,
  ) {}

  async getCalendarEvents(operatorId?: string): Promise<any[]> {
    const filter: any = {};
    if (operatorId && Types.ObjectId.isValid(operatorId)) {
      filter.operatorId = operatorId;
    }

    // Fetch dalle 3 collezioni in parallelo
    const [attendances, permissions, illnesses] = await Promise.all([
      this.attendanceModel.find(filter)
          .populate<{ operatorId: any }>('operatorId')
          .lean()
          .exec(),
      this.permissionHolidayModel.find({...filter, accepted: true})
          .populate<{ operatorId: any }>('operatorId')
          .lean()
          .exec(),
      this.illnessModel.find(filter)
          .populate<{ operatorId: any }>('operatorId')
          .lean()
          .exec()
    ]);

    const events: any[] = [];

    // Attendance → PRESENCE
    attendances.forEach(a => {
      events.push({
        tipologia: 'presenza',
        id: a._id,
        title: 'Presenza', 
        fullName: `${a.operatorId?.name ?? ''} ${a.operatorId?.lastName ?? ''}`, 
        start: a.entryTime ? `${a.date.toISOString().split('T')[0]}T${a.entryTime}` : a.date,
        end: a.exitTime ? `${a.date.toISOString().split('T')[0]}T${a.exitTime}` : a.date,
        color: '#6FA8DC',
        startHour: a.entryTime,
        endHour: a.exitTime
      });
    });

    // PermissionHoliday → ABSENCE
    permissions.forEach(p => {
      let title ='Ferie' 
      
      if(p.type == 2)
        title = 'Permesso';

      if(p.type == 3)
        title = 'Assenza ingiustificata';

      // se non è assenza, calcolo la differenza ore
      if (p.type != 1 && p.type != 3 && p.startHour && p.endHour) {
        const start = new Date(`${p.startDate.toISOString().split('T')[0]}T${p.startHour}`);
        const end = new Date(`${p.endDate.toISOString().split('T')[0]}T${p.endHour}`);
        const diffMs = end.getTime() - start.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);
        title += ` (${diffHours.toFixed(2)}h)`;
      }

      // Costruzione start/end in formato ISO corretto
      const start = p.startHour
        ? `${p.startDate.toISOString().split('T')[0]}T${p.startHour}`
        : p.startDate.toISOString().split('T')[0];

      const end = p.endHour
        ? `${p.endDate.toISOString().split('T')[0]}T${p.endHour}`
        : p.endDate.toISOString().split('T')[0];

      events.push({
        tipologia: 'assenza',
        id: p._id,
        title,
        fullName: `${p.operatorId?.name ?? ''} ${p.operatorId?.lastName ?? ''}`,
        reason: p.reason,
        start,
        end,
        color: '#FFB347',
        allDay: !p.startHour && !p.endHour,
        startHour: p.startHour,
        endHour: p.endHour,
      });
    });

    // Illness → ILLNESS
    illnesses.forEach(i => {
      events.push({
        tipologia: 'malattia',
        id: i._id,
        title: 'Malattia', 
        fullName: `${i.operatorId?.name ?? ''} ${i.operatorId?.lastName ?? ''}`, 
        start: i.start,
        end: i.end,
        color: '#E57373',
        allDay: true,
        startHour: null,
        endHour: null
      });
    });

    return events.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  }


  async getMonthlyCalendarEvents(
    month: number, // 1-12
    year: number,
    operatorId?: string
  ): Promise<any[]> {
    const filter: any = {};
    if (operatorId && Types.ObjectId.isValid(operatorId)) {
      filter.operatorId = operatorId;
    }

    // Calcola inizio e fine mese
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    // Attendances
    const attendances = await this.attendanceModel.find({
      ...filter,
      date: { $gte: startDate, $lte: endDate },
    })
      .populate<{ operatorId: any }>('operatorId')
      .lean();

    // PermissionHoliday
    const permissions = await this.permissionHolidayModel.find({
      ...filter,
      accepted: true,
      startDate: { $lte: endDate },
      endDate: { $gte: startDate },
    })
      .populate<{ operatorId: any }>('operatorId')
      .lean();

    // Illness
    const illnesses = await this.illnessModel.find({
      ...filter,
      start: { $lte: endDate },
      end: { $gte: startDate },
    })
      .populate<{ operatorId: any }>('operatorId')
      .lean();

    const events: any[] = [];

    // Attendance → PRESENCE
    attendances.forEach(a => {

      const permissionMinutes =
      this.calculatePermissionMinutesForDay(
        permissions,
        a.operatorId._id,
        a.date
      );

      events.push({
        tipologia: 'presenza',
        id: a._id,
        title: 'Presenza', 
        operatorStartTime: a.operatorId.startTime,
        operatorEndTime: a.operatorId.endTime,
        fullName: `${a.operatorId?.name ?? ''} ${a.operatorId?.lastName ?? ''}`, 
        date: a.date.toISOString().split('T')[0],
        startHour: a.entryTime,
        endHour: a.exitTime,
        permissionMinutes,
        
        // 👉 BREAKS
        breaks: a.breaks?.map(b => ({
          start: b.start,
          end: b.end
        })) ?? []
      });
    });

    // PermissionHoliday → ABSENCE
    permissions.forEach(p => {
      let title = 'Ferie';
      if(p.type == 2)
        title = 'Permesso';
      if(p.type == 3)
        title = 'Assenza ingiustificata';
      events.push({
        tipologia: 'assenza',
        id: p._id,
        title: title,
        fullName: `${p.operatorId?.name ?? ''} ${p.operatorId?.lastName ?? ''}`,
        startDate: p.startDate.toISOString().split('T')[0],
        endDate: p.endDate.toISOString().split('T')[0],
        startHour: p.startHour,
        endHour: p.endHour,
      });
    });

    // Illness → ILLNESS
    illnesses.forEach(i => {
      events.push({
        tipologia: 'malattia',
        id: i._id,
        title: 'Malattia', 
        fullName: `${i.operatorId?.name ?? ''} ${i.operatorId?.lastName ?? ''}`, 
        startDate: i.start!.toISOString().split('T')[0],
        endDate: i.end!.toISOString().split('T')[0],
      });
    });

    return events;
  }

  toMinutes = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  };

  calculatePermissionMinutesForDay(
    permissions: any[],
    operatorId: string,
    day: Date
  ): number {

    const dayStart = new Date(day);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(day);
    dayEnd.setHours(23, 59, 59, 999);

    let minutes = 0;

    permissions.forEach(p => {
      if (
        p.type !== 2 || // solo PERMESSO
        String(p.operatorId?._id) !== String(operatorId)
      ) return;

      // verifica sovrapposizione giorno
      if (p.startDate > dayEnd || p.endDate < dayStart) return;

      // permesso orario
      if (p.startHour && p.endHour) {
        minutes += Math.max(
          0,
          this.toMinutes(p.endHour) - this.toMinutes(p.startHour)
        );
      }
    });

    return minutes;
  }
}

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
      let title = p.type == 1 ? 'Ferie' : 'Permesso';

      // se non è assenza, calcolo la differenza ore
      if (p.type != 1 && p.startHour && p.endHour) {
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
}

import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AttendanceDto } from 'src/dto/attendance.dto';
import { normalizeDate } from 'src/enum/enum';
import { Attendance, AttendanceDocument } from 'src/schemas/attendance.schema';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel(Attendance.name)
    private readonly attendanceModel: Model<AttendanceDocument>,
  ) {}

  async create(dto: AttendanceDto): Promise<Attendance> {
    const normalizedDate = normalizeDate(dto.date);
    try {
    const created = new this.attendanceModel({
      ...dto,
      date: normalizedDate
    });

    return await created.save();
  } catch (error) {
    if (error.code === 11000) {
      throw new ConflictException(
        'Esiste già una presenza per questo operatore in questa data'
      );
    }
    throw error;
  }
  }

  async findAll(operatorId?: string): Promise<Attendance[]> {
    const filter = operatorId ? { operatorId } : {};
    return this.attendanceModel
      .find(filter)
      .populate('operatorId')
      .sort({ date: -1 })
      .exec();
  }

  async findById(id: string): Promise<Attendance | null> {
    return this.attendanceModel.findById(id).populate('operatorId').exec();
  }

  async update(id: string, dto: Partial<AttendanceDto>): Promise<Attendance | null> {
    return this.attendanceModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async delete(id: string): Promise<Attendance | null> {
    return this.attendanceModel.findByIdAndDelete(id).exec();
  }
  
 // ✅ Controlla se esiste una presenza per oggi
  async existTodayAttendance(operatorId: string): Promise<boolean> {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const attendance = await this.attendanceModel.findOne({
      operatorId,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    return !!attendance;
  }

  // ✅ Recupera la presenza di oggi
  async getTodayAttendance(operatorId: string) {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    return this.attendanceModel.findOne({
      operatorId,
      date: { $gte: startOfDay, $lte: endOfDay },
    });
  } 
}

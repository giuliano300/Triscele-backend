import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AttendanceDto } from 'src/dto/attendance.dto';
import { Attendance, AttendanceDocument } from 'src/schemas/attendance.schema';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel(Attendance.name)
    private readonly attendanceModel: Model<AttendanceDocument>,
  ) {}

  async create(dto: AttendanceDto): Promise<Attendance> {
    const created = new this.attendanceModel(dto);
    return created.save();
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
  
}

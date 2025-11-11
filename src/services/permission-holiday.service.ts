import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PermissionHolidayDto } from 'src/dto/permission-holiday.dto';
import { PermissionHoliday, PermissionHolidayDocument } from 'src/schemas/permission-holiday.schema';
@Injectable()
export class PermissionHolidayService {
  constructor(
    @InjectModel(PermissionHoliday.name)
    private readonly permissionHolidayModel: Model<PermissionHolidayDocument>,
  ) {}

    async create(dto: PermissionHolidayDto): Promise<PermissionHoliday> {
        const created = new this.permissionHolidayModel({
        ...dto,
        createdAt: new Date()
        });
        return created.save();
    }

    async findAll(operatorId?: string): Promise<PermissionHoliday[]> {
    const filter = operatorId ? { operatorId } : {};
    return this.permissionHolidayModel
        .find(filter)
        .populate('operatorId')
        .sort({ createdAt: -1 })
        .exec();
    }

    async findById(id: string): Promise<PermissionHoliday | null> {
        return this.permissionHolidayModel.findById(id).populate('operatorId').exec();
    }

    async update(id: string, dto: Partial<PermissionHolidayDto>): Promise<PermissionHoliday | null> {
        return this.permissionHolidayModel.findByIdAndUpdate(id, 
            {
            ...dto,
            updatedAt: new Date()
            }, 
            { new: true }).exec();
    }

    async delete(id: string): Promise<PermissionHoliday | null> {
        return this.permissionHolidayModel.findByIdAndDelete(id).exec();
    }
}

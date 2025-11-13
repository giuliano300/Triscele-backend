/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, NotFoundException } from '@nestjs/common';
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

    async update(id: string, dto: PermissionHolidayDto): Promise<PermissionHoliday | null> {
        const p = this.permissionHolidayModel.findByIdAndUpdate(id, 
        {
            ...dto,
            updatedAt: new Date()
        }, 
        { new: true }).exec();
        if (!p) 
        {
            throw new NotFoundException(`p con ID ${id} non trovato`);
        }
        return p;
    }

    async delete(id: string): Promise<PermissionHoliday | null> {
        return this.permissionHolidayModel.findByIdAndDelete(id).exec();
    }

    async countPending(operatorId?: string): Promise<number> {
        const filter: any = { accepted: { $eq: null } }; // accetta solo valori null
        if (operatorId) {
            filter.operatorId = operatorId;
        }

        return this.permissionHolidayModel.countDocuments(filter).exec();
    }
}

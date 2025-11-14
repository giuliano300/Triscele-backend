/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PermissionHolidayDto } from 'src/dto/permission-holiday.dto';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';
import { Operator, OperatorDocument } from 'src/schemas/operators.schema';
import { PermissionHoliday, PermissionHolidayDocument } from 'src/schemas/permission-holiday.schema';

@Injectable()
export class PermissionHolidayService {
  constructor(
    private notifications: NotificationsGateway,
    @InjectModel(PermissionHoliday.name)
    private readonly permissionHolidayModel: Model<PermissionHolidayDocument>,
    @InjectModel(Operator.name)
    private readonly operatorModel: Model<OperatorDocument>, // 🔹 iniezione modello operator
  ) {}

  async create(dto: PermissionHolidayDto): Promise<PermissionHoliday> {
    // 🔹 crea la richiesta
    const created = new this.permissionHolidayModel({
      ...dto,
      createdAt: new Date()
    });
    const result = await created.save(); // 🔹 await qui

    // 🔹 recupera l'operatore
    const operator = await this.operatorModel.findById(dto.operatorId);
    if (!operator) {
      throw new NotFoundException(`Operatore con ID ${dto.operatorId} non trovato`);
    }
    const operatorName = operator.businessName;

    // 🔹 invia notifica real-time tramite Socket
    this.notifications.sendNewAbsence(operatorName);

    return result;
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
    return this.permissionHolidayModel
      .findById(id)
      .populate('operatorId')
      .exec();
  }

  async update(id: string, dto: PermissionHolidayDto): Promise<PermissionHoliday | null> {
    // 1. Recupero documento originale
    const old = await this.permissionHolidayModel.findById(id).exec();

    if (!old) {
      throw new NotFoundException(`PermissionHoliday con ID ${id} non trovato`);
    }

    // 2. Aggiornamento documento
    const p = await this.permissionHolidayModel
      .findByIdAndUpdate(
        id,
        { ...dto, updatedAt: new Date() },
        { new: true }
      )
      .exec();

    // 3. Invio notifica SOLO se prima era null
    if (old.accepted === null && p!.accepted !== null)
      this.notifications.confirmAbsence(p!);

    return p;
  }

  async delete(id: string): Promise<PermissionHoliday | null> {
    return this.permissionHolidayModel.findByIdAndDelete(id).exec();
  }

  async countPending(operatorId?: string): Promise<number> {
    const filter: any = { accepted: { $eq: null } };
    if (operatorId) {
      filter.operatorId = operatorId;
    }
    return this.permissionHolidayModel.countDocuments(filter).exec();
  }
}

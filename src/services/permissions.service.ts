import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Permission, PermissionDocument } from 'src/schemas/permission.schema';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name) private PermissionsModel: Model<PermissionDocument>,
  ) {}

  // Recupera tutti i Permissions
  async findAll(): Promise<Permission[]> {
    return this.PermissionsModel.find().exec();
  }

  // Recupera un Permissions per ID
  async findOne(id: string): Promise<Permission> {
    const Permissions = await this.PermissionsModel.findById(id).exec();
    if (!Permissions) {
      throw new NotFoundException(`Permissions con ID ${id} non trovato`);
    }
    return Permissions;
  }
}

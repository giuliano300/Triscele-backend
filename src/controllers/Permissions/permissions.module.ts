import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {  Permission, PermissionSchema } from 'src/schemas/permission.schema';
import { PermissionController } from './permissions.controller';
import { PermissionsService } from 'src/services/permissions.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Permission.name, schema: PermissionSchema }]),
  ],
  controllers: [PermissionController],
  providers: [PermissionsService],
})
export class PermissionsModule {}

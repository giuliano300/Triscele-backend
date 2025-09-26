import { Controller, Get, Param } from '@nestjs/common';
import { Permission } from 'src/schemas/permission.schema';
import { PermissionsService } from 'src/services/permissions.service';

@Controller('Permissions')
export class PermissionController {
  constructor(private readonly PermissionService: PermissionsService) {}


  @Get()
  async findAll(): Promise<Permission[]> {
    return this.PermissionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Permission> {
    return this.PermissionService.findOne(id);
  }

}

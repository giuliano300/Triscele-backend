import { Controller, Get, Param, Put } from '@nestjs/common';

import { NotificationsService } from 'src/services/notification.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly NotificationsService: NotificationsService) {}
  
  @Get()
  async findAll() {
    return this.NotificationsService.getAdminNotRead();
  }

  @Get('getAdminNotRead')
  async getAdminNotRead() {
    return this.NotificationsService.getAdminNotRead();
  }

  @Get('getCustomerNotRead/:customerId')
  async getCustomerNotRead(@Param('customerId') customerId: string) {
    return this.NotificationsService.getCustomerNotRead(customerId);
  }

  @Get('getOperatorNotRead/:operatorId')
  async getOperatorNotRead(@Param('operatorId') operatorId: string){
    return this.NotificationsService.getOperatorNotRead(operatorId);
  }

 @Put('markAsRead/:id')
  async markAsRead(@Param('id') id: string) {
    console.log('ID ricevuto:', id);
    return this.NotificationsService.markAsRead(id);
  }
}

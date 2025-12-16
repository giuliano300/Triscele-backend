/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Notifications, NotificationDocument } from "src/schemas/notifications.schema";

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notifications.name)
    private readonly model: Model<NotificationDocument>,
  ) {}

  async create(
    userId: string | null,
    role: 'admin' | 'operator' | 'customer',
    event: string,
    payload: any
  ): Promise<NotificationDocument> {
    const notification = new this.model({
        userId,
        userRole: role,
        event,
        payload,
        read: false,
      });

  return notification.save(); 
  }

  async markAsRead(id: string) {
    return this.model.updateOne(
      { _id: id },
      { $set: { read: true } }
    );
  }

  // Admin (userId null)
  async getAdminNotRead(): Promise<Notifications[]> {
    return this.model.find({
      userRole: 'admin',
      read: false
    }).sort({ createdAt: -1 });
  }

  // Customer (per customerId specifico)
  async getCustomerNotRead(customerId: string): Promise<Notifications[]> {
    return this.model.find({
      userRole: 'customer',
      userId: customerId,
      read: false
    }).sort({ createdAt: -1 });
  }

  // Operator (per operatorId specifico)
  async getOperatorNotRead(operatorId: string): Promise<Notifications[]> {
    return this.model.find({
      userRole: 'operator',
      userId: operatorId,
      read: false
    }).sort({ createdAt: -1 });
  }
}

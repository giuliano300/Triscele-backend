import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from '../schemas/order.schema';
import { Customer } from '../schemas/customers.schema';

@Injectable()
export class StatsService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
  ) {}

  async getStats(year?: number) {
    const currentYear = year || new Date().getFullYear();

    // Totali base
    const totalOrders = await this.orderModel.countDocuments();
    const totalCustomers = await this.customerModel.countDocuments();

    // Aggregazione per mese basata su insertDate
    const ordersByMonth = await this.orderModel.aggregate([
      {
        $match: {
          insertDate: {
            $gte: new Date(`${currentYear}-01-01`),
            $lt: new Date(`${currentYear + 1}-01-01`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$insertDate' }, 
          orders: { $sum: 1 },
          totalAmount: { $sum: '$totalPrice' }
        },
      },
      { $sort: { '_id': 1 } },
    ]);

    // Normalizzo i 12 mesi
    const months = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      orders: 0,
      totalAmount: 0,
    }));

    ordersByMonth.forEach((m) => {
      months[m._id - 1] = {
        month: m._id,
        orders: m.orders,
        totalAmount: m.totalAmount,
      };
    });

    return {
      totalOrders,
      totalCustomers,
      ordersByMonth: months,
    };
  }
}

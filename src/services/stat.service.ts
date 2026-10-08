/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order } from '../schemas/order.schema';
import { Customer } from '../schemas/customers.schema';
import { Agent } from '../schemas/agent.schema';
import { OrderState } from '../schemas/order-state.schema';

@Injectable()
export class StatsService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
    @InjectModel(Agent.name) private agentModel: Model<Agent>,
    @InjectModel(OrderState.name) private orderStateModel: Model<OrderState>,
  ) {}

  private normalizeDashboardLimit(limit?: number): number {
    if (!limit || Number.isNaN(limit)) return 5;
    return Math.min(Math.max(limit, 1), 10);
  }

  async getOpenQuotes(limit?: number) {
    const resultLimit = this.normalizeDashboardLimit(limit);
    const quotes = await this.orderModel
      .find({ status: null })
      .sort({ insertDate: -1, createdAt: -1, _id: -1 })
      .limit(resultLimit)
      .select('_id quoteNumber customerId shippingBusinessName insertDate totalPrice status')
      .populate('customerId', 'businessName')
      .lean()
      .exec();

    return quotes.map((quote: any) => ({
      id: quote._id.toString(),
      quoteNumber: quote.quoteNumber,
      customer: quote.customerId?.businessName ?? quote.shippingBusinessName ?? '-',
      date: quote.insertDate,
      totalPrice: quote.totalPrice,
      status: quote.status
    }));
  }

  async getRecentApprovedOrders(limit?: number) {
    const resultLimit = this.normalizeDashboardLimit(limit);
    const cancelledStates = await this.orderStateModel
      .find({ name: { $regex: '^annullat[oa]$', $options: 'i' } })
      .select('_id')
      .lean()
      .exec();
    const cancelledStatusIds = cancelledStates.map(state => state._id);
    const statusFilter: any = { $exists: true, $ne: null };
    if (cancelledStatusIds.length) {
      statusFilter.$nin = cancelledStatusIds;
    }

    const orders = await this.orderModel
      .find({ status: statusFilter })
      .sort({ approvedAt: -1, _id: -1 })
      .limit(resultLimit)
      .select('_id orderNumber customerId shippingBusinessName approvedAt insertDate totalPrice agentId status')
      .populate('customerId', 'businessName')
      .populate('status', 'name color')
      .lean()
      .exec();

    const agentIds = [
      ...new Set(
        orders
          .map((order: any) => order.agentId)
          .filter((agentId: string | undefined) => agentId && Types.ObjectId.isValid(agentId))
      )
    ];
    const agents = agentIds.length
      ? await this.agentModel
          .find({ _id: { $in: agentIds.map(id => new Types.ObjectId(id)) } })
          .select('_id name')
          .lean()
          .exec()
      : [];
    const agentsById = new Map(
      agents.map(agent => [agent._id.toString(), agent.name])
    );

    return orders.map((order: any) => ({
      id: order._id.toString(),
      orderNumber: order.orderNumber,
      customer: order.customerId?.businessName ?? order.shippingBusinessName ?? '-',
      approvedAt: order.approvedAt ?? order.insertDate,
      totalPrice: order.totalPrice,
      agent: order.agentId ? agentsById.get(order.agentId.toString()) ?? '-' : '-',
      status: order.status
    }));
  }

  async getStats(year?: number) {
    const currentYear = year || new Date().getFullYear();

    // Totali base
    const totalOrders = await this.orderModel.countDocuments();
    const totalCustomers = await this.customerModel.countDocuments();

    // Aggregazione per mese basata su insertDate
    const ordersByMonth = await this.orderModel.aggregate([
      {
        $match: {
          status: { $ne: null },
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

  async getStatsOfCustomer(year?: number, customerId?: string) {
    const currentYear = year || new Date().getFullYear();
    
    const matchFilter: any = {
      customerId: new Types.ObjectId(customerId)
    };
    // Totali base
      const totalOrders = await this.orderModel.countDocuments({
        ...matchFilter,
        status: { $ne: null },
      });

      const totalQuotations = await this.orderModel.countDocuments({
        ...matchFilter,
        status: null,
      });

    // Aggregazione per mese basata su insertDate
    const ordersByMonth = await this.orderModel.aggregate([
      {
        $match: {
          customerId: new Types.ObjectId(customerId),
          status: { $ne: null },
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
      totalQuotations,
      ordersByMonth: months,
    };
  }
}

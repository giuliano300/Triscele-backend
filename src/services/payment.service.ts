import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Payment } from '../schemas/payment.schema';
import { Model } from 'mongoose';
import { CreatePaymentDto } from '../dto/create-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    return await this.paymentModel.create(createPaymentDto);
  }

  async findByBooking(bookingId: string): Promise<Payment[]> {
    return await this.paymentModel.find({ booking: bookingId }).exec();
  }
}

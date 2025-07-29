import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { FilterQuery, Model, Types } from 'mongoose';
import { Booking, BookingDocument } from '../schemas/booking.schema';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { UpdateBookingDto } from '../dto/update-booking.dto';
import { FilterBookingsDto } from 'src/filters/filter-bookings.dto';
import { Payment, PaymentDocument } from 'src/schemas/payment.schema';
import { BookingWithPayments } from 'src/interfaces/BookingWithPayments';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
  ) {}

  async create(createBookingDto: CreateBookingDto, userId: string): Promise<Booking> {
    const booking = new this.bookingModel({
      ...createBookingDto,
      user: new mongoose.Types.ObjectId(userId),
      space: new mongoose.Types.ObjectId(createBookingDto.spaceId),
    });
    return booking.save();
  }

  async findAll(filterDto: FilterBookingsDto): Promise<BookingWithPayments[]> {
    const { spaceId, userId, date, status, start, end } = filterDto;

    const query: FilterQuery<Booking> = {};

    if (spaceId)
      query.space = new Types.ObjectId(spaceId);

    if (userId)
      query.user = new Types.ObjectId(userId);

    if (date)
      query.date = date;

    if (start)
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      query.date >= start;

    if (end)
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      query.date <= end;

    if (status)
      query.status = status;

    const bookings = await this.bookingModel
      .find(query)
      .populate('user')
      .populate('space')
      .exec();

      const bookingsWithPayments: BookingWithPayments[] = await Promise.all(
        bookings.map(async (booking) => {
          const payments = await this.paymentModel.find({ bookingId: booking._id }).exec();
          return { booking, payments };
        }),
      );
      
      return bookingsWithPayments;
  }

  async findByUser(userId: string): Promise<Booking[]> {
    return this.bookingModel.find({ user: userId }).populate('space').exec();
  }

  async findBySpace(spaceId: string): Promise<Booking[]> {
    return this.bookingModel.find({ space: spaceId }).populate('user').exec();
  }

  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingModel.findById(id).populate('user').populate('space').exec();
    if (!booking) {
      throw new NotFoundException(`Booking #${id} not found`);
    }
    return booking;
  }

  async update(id: string, updateBookingDto: UpdateBookingDto): Promise<Booking> {
    const updated = await this.bookingModel.findByIdAndUpdate(id, updateBookingDto, { new: true }).exec();
    if (!updated) {
      throw new NotFoundException(`Booking #${id} not found`);
    }
    return updated;
  }

  async remove(id: string): Promise<void> {
    const result = await this.bookingModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Booking #${id} not found`);
    }
  }
}

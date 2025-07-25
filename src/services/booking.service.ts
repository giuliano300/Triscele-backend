import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { FilterQuery, Model, Types } from 'mongoose';
import { Booking, BookingDocument } from '../schemas/booking.schema';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { UpdateBookingDto } from '../dto/update-booking.dto';
import { FilterBookingsDto } from 'src/filters/filter-bookings.dto';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
  ) {}

  async create(createBookingDto: CreateBookingDto, userId: string): Promise<Booking> {
    const booking = new this.bookingModel({
      ...createBookingDto,
      user: new mongoose.Types.ObjectId(userId),
      space: new mongoose.Types.ObjectId(createBookingDto.spaceId),
    });
    return booking.save();
  }

  async findAll(filterDto: FilterBookingsDto): Promise<Booking[]> {
    const { spaceId, userId, date, status } = filterDto;

    const query: FilterQuery<Booking> = {};

    if (spaceId)
      query.space = new Types.ObjectId(spaceId);

    if (userId)
      query.user = new Types.ObjectId(userId);

    if (date)
      query.date = date;

    if (status)
      query.status = status;

    return this.bookingModel
      .find(query)
      .populate('user')
      .populate('space')
      .exec();
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

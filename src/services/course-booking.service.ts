import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { CourseBooking } from 'src/schemas/course-booking.schema';
import { CreateCourseBookingDto } from 'src/dto/create-course-booking.dto';
import { FilterCourseBookingDto } from 'src/filters/filter-course-booking.dto';
import { Course } from 'src/schemas/course.schema';

@Injectable()
export class CourseBookingsService {
  constructor(
    @InjectModel(Course.name) private courseBookingModel: Model<CourseBooking>,
  ) {}

  async create(dto: CreateCourseBookingDto, userId: string): Promise<CourseBooking> {
    const booking = new this.courseBookingModel({
      user: userId,
      course: dto.courseId,
      status: 'pending'
    });
    return booking.save();
  }

  async findAll(filters: FilterCourseBookingDto): Promise<CourseBooking[]> {
    const query: FilterQuery<CourseBooking> = {};
    if (filters.userId) query.user = new Types.ObjectId(filters.userId);
    if (filters.courseId) query.course = new Types.ObjectId(filters.courseId);
    if (filters.status) query.status = filters.status;
    return this.courseBookingModel.find(query).populate('user').populate('course').exec();
  }
}

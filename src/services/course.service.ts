import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Course, CourseDocument } from "../schemas/course.schema";
import { CreateCourseDto } from "../dto/create-course.dto";
import { UpdateCourseDto } from "src/dto/update-course.dto";

@Injectable()
export class CourseService {
  constructor(@InjectModel(Course.name) private courseModel: Model<CourseDocument>) {}

  async create(dto: CreateCourseDto): Promise<Course> {
    const course = new this.courseModel(dto);
    return course.save();
  }

  async findAll(): Promise<Course[]> {
    return this.courseModel.find().populate('booking').populate('participants');
  }

  async findOne(id: string): Promise<Course | null> {
    return this.courseModel.findById(id).populate('booking').populate('participants');
  }

  async update(id: string, dto: UpdateCourseDto): Promise<Course | null> {
    return this.courseModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async remove(id: string): Promise<void> {
    await this.courseModel.findByIdAndDelete(id);
  }
}

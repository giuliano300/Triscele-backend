import { MongooseModule } from "@nestjs/mongoose";
import { Module } from '@nestjs/common';
import { CoursesController } from "./courses.controller";
import { CourseService } from "src/services/course.service";
import { Course, CourseSchema } from "src/schemas/course.schema";


@Module({
  imports: [MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }])],
  controllers: [CoursesController],
  providers: [CourseService],
})
export class CoursesModule {}

import { Prop } from "@nestjs/mongoose";
import { IsDateString, IsMongoId, IsString } from "class-validator";

// create-course.dto.ts
export class CreateCourseDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsDateString()
  date: Date;

  @Prop({ required: true })
  startTime: string;

  @Prop({ required: true })
  endTime: string;

  @IsMongoId()
  booking: string;
}

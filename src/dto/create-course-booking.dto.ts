import { IsMongoId } from "class-validator";

export class CreateCourseBookingDto {
  @IsMongoId()
  courseId: string;
}

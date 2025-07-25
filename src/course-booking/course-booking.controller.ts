import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import { Roles } from "../roles/roles.decorator";
import { RolesGuard } from "../roles/roles.guard";
import { AuthGuard } from "@nestjs/passport";
import { CreateCourseBookingDto } from "src/dto/create-course-booking.dto";
import { CourseBookingsService } from "src/services/course-booking.service";
import { FilterCourseBookingDto } from "src/filters/filter-course-booking.dto";

@Controller('course-bookings')
export class CourseBookingsController {
  constructor(private readonly courseBookingsService: CourseBookingsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin','gestore')
  async create(@Body() dto: CreateCourseBookingDto, @Req() req) {
    return this.courseBookingsService.create(dto, req.user.userId);
  }


  @Get()
  async findAll(@Query() filterDto: FilterCourseBookingDto) {
    return this.courseBookingsService.findAll(filterDto);
  }

}

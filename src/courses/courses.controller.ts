import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { CourseService } from "src/services/course.service";
import { CreateCourseDto } from "src/dto/create-course.dto";
import { UpdateCourseDto } from "src/dto/update-course.dto";

@Controller('courses')
export class CoursesController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  create(@Body() dto: CreateCourseDto) {
    return this.courseService.create(dto);
  }

  @Get()
  findAll() {
    return this.courseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCourseDto) {
    return this.courseService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courseService.remove(id);
  }
}

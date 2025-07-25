import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { CreateBookingDto } from "../dto/create-booking.dto";
import { UpdateBookingDto } from "../dto/update-booking.dto";
import { Roles } from "../roles/roles.decorator";
import { RolesGuard } from "../roles/roles.guard";
import { BookingService } from "../services/booking.service";
import { AuthGuard } from "@nestjs/passport";
import { FilterBookingsDto } from "src/filters/filter-bookings.dto";

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin','gestore')
  async create(@Body() dto: CreateBookingDto, @Req() req) {
    return this.bookingsService.create(dto, req.user.userId);
  }

  @Get()
  async findAll(@Query() filterDto: FilterBookingsDto) {
    return this.bookingsService.findAll(filterDto);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin','gestore')
  async findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  async update(@Param('id') id: string, @Body() dto: UpdateBookingDto) {
    return this.bookingsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  async remove(@Param('id') id: string) {
    return this.bookingsService.remove(id);
  }
}

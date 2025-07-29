import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CreatePaymentDto } from "../../dto/create-payment.dto";
import { PaymentService } from "../../services/payment.service";

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async create(@Body() dto: CreatePaymentDto) {
    return await this.paymentService.create(dto);
  }

  @Get('by-booking/:bookingId')
  async getByBooking(@Param('bookingId') bookingId: string) {
    return await this.paymentService.findByBooking(bookingId);
  }
}
import { MongooseModule } from "@nestjs/mongoose";
import { Module } from '@nestjs/common';
import { Booking, BookingSchema } from '../../schemas/booking.schema';
import { BookingsController } from "./booking.controller";
import { BookingService } from '../../services/booking.service';
import { User, UserSchema } from "src/schemas/user.schema";
import { Space, SpaceSchema } from "src/schemas/space.schema";
import { Payment, PaymentSchema } from "src/schemas/payment.schema";


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Space.name, schema: SpaceSchema }]),
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }])
  ],
  controllers: [BookingsController],
  providers: [BookingService],
})
export class BookingsModule {}

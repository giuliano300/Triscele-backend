import { MongooseModule } from "@nestjs/mongoose";
import { Module } from '@nestjs/common';
import { PaymentController } from "./payment.controller";
import { PaymentService } from "../../services/payment.service";
import { Payment, PaymentSchema } from "../../schemas/payment.schema";


@Module({
  imports: [MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }])],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}

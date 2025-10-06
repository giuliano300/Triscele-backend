import { IsNotEmpty, IsString, IsEnum, IsNumber, IsArray } from 'class-validator';
import { OrderStatus, PaymentMethod } from 'src/enum/enum';
import { OrderProducts } from 'src/interfaces/orderProduct';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  customerId: string;

  @IsNotEmpty()
  @IsString()
  operatorId: string;

  @IsNotEmpty()
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsNotEmpty()
  insertDate: Date;

  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsNotEmpty()
  expectedDelivery: Date;

  @IsNotEmpty()
  origin: string;

  @IsNotEmpty()
  @IsNumber()
  agent: number;

  @IsNotEmpty()
  shippingAddress: string;

  @IsNotEmpty()
  shippingZipcode: string;

  @IsNotEmpty()
  shippingProvince: string;

  @IsNotEmpty()
  shippingCity: string;

  shippingName?: string;
  shippingLastName?: string;

  @IsNotEmpty()
  shippingBusinessName: string;

  @IsNotEmpty()
  shippingTelephone: string;

  @IsNotEmpty()
  shippingEmail: string;

  note?: string;

  @IsNotEmpty()
  @IsArray()
  orderProducts: OrderProducts[];

  @IsNotEmpty()
  @IsNumber()
  totalPrice: number;

}

export class UpdateOrderDto extends CreateOrderDto {}

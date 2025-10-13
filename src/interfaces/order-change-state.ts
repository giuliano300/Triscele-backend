import { IsDate, IsEnum, IsOptional, IsString } from "class-validator";
import { OrderStatus } from "src/enum/enum";

export class OrderChangeState {
  @IsEnum(OrderStatus)
  orderState: OrderStatus;
  
  @IsString()
  orderId: string;

  @IsEnum(OrderStatus)
  oldStatus: OrderStatus;

  @IsEnum(OrderStatus)
  newStatus: OrderStatus;

  @IsDate()
  changedAt: Date;
  
  @IsOptional()
  @IsString()
  operatorId?: string;
}
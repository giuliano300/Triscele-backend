import { IsDate, IsOptional, IsString } from "class-validator";

export class OrderChangeState {
  @IsString()
  orderState: string;
  
  @IsString()
  orderId: string;

  @IsString()
  oldStatus: string;

  @IsString()
  newStatus: string;

  @IsDate()
  changedAt: Date;
  
  @IsOptional()
  @IsString()
  operatorId?: string;

  @IsOptional()
  @IsString()
  operatorName?: string;
}
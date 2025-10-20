import { IsOptional, IsString } from 'class-validator';

export class UpdateOnlyOperatorDataOrderDto {
  @IsOptional()
  @IsString()
  operatorId?: string;

  @IsOptional()
  @IsString()
  orderId?: string;

  @IsOptional()
  @IsString()
  status?: string;
}

import { IsBoolean, IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class PermissionHolidayDto {
  @IsInt()
  type: number;

  @IsString()
  operatorId: string;

  @IsDateString()
  startDate: Date;

  @IsDateString()
  endDate: Date;

  @IsOptional()
  @IsString()
  startHour?: string;

  @IsOptional()
  @IsString()
  endHour?: string;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsBoolean()
  accepted?: boolean;

  @IsOptional()
  @IsBoolean()
  read?: boolean;

  @IsOptional()
  @IsString()
  rejectedReason?: string;
}

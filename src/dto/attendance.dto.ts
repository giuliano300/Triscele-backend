import { IsDateString, IsOptional, IsString } from 'class-validator';

export class AttendanceDto {
  @IsString()
  operatorId: string; // ObjectId come stringa

  @IsDateString()
  date: Date;

  @IsString()
  entryTime: string; // "HH:mm:ss"

  @IsString()
  exitTime: string;  // "HH:mm:ss"

  @IsOptional()
  @IsString()
  notes?: string;
}

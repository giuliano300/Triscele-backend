import { IsOptional, IsString } from 'class-validator';

export class CreateHolidayDto {

  @IsString()
  date: string; // YYYY-MM-DD

  @IsOptional()
  @IsString()
  description?: string;
}

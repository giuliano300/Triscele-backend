import { IsIP, IsOptional, IsString } from 'class-validator';

export class CreateAllowedIpDto {
  @IsIP()
  ip: string;

  @IsOptional()
  @IsString()
  description?: string;
}

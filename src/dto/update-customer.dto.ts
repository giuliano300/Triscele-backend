import { IsEmail, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateCustomerDto {
  @IsOptional()
  @IsString()
  businessName?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  birthDate?: string;

  @IsOptional()
  @IsString()
  mobile?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  sdi: string;

  @IsString()
  vatNumber: string;

  @IsOptional()
  @IsNumber()
  status: number;

  @IsString()
  province: string;

  @IsString()
  address: string;

  @IsString()
  zipCode: string;

  @IsString()
  customerNote?: string;

  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  agentName?: string;
}

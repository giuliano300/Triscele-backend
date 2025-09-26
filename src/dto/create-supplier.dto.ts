import { IsEmail, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateSupplierDto {
  @IsString()
  businessName: string;

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

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  sdi: string;

  @IsString()
  vatNumber: string;

  @IsNumber()
  status: number;

  @IsString()
  province: string;

  @IsString()
  address: string;

  @IsString()
  zipCode: string;

  @IsString()
  city: string;

  @IsString()
  pwd: string;

  @IsOptional()
  @IsString()
  agentName?: string;
}
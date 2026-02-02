import { IsEmail, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateSupplierDto {
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
  
  @IsOptional()
  @IsString()
  pwd: string;

  @IsOptional()
  @IsString()
  agentName?: string;
}

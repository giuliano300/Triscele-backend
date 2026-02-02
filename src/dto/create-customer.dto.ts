import { IsEmail, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCustomerDto {
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
  pwd?: string;

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
  customerNote?: string;

  @IsString()
  zipCode: string;

  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  agentName?: string;
}
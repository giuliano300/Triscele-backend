import { Type } from "class-transformer";
import { IsArray, IsEmail, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { PermissionDto } from "./permission.dto";

export class CreateOperatorDto {
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

  @IsString()
  fiscalCode: string;

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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PermissionDto)
  permissions: PermissionDto[];
}
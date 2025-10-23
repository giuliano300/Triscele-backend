import { Type } from "class-transformer";
import { IsArray, IsEmail, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { PermissionDto } from "./permission.dto";

export class CreateOperatorDto {

  @IsOptional()
  @IsString()
  businessName: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsEmail()
  email: string;

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

  @IsString()
  sectorId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PermissionDto)
  permissions: PermissionDto[];
}
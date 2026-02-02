import { Type } from "class-transformer";
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested
} from "class-validator";
import { PermissionDto } from "./permission.dto";
import { LoginType } from "src/enum/enum";

export class CreateOperatorDto {
  @IsEnum(LoginType)
  loginType: LoginType;

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

  @Type(() => Number)
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

  // --------------------------------------------
  //  NUOVI CAMPI ORARI TEORICI
  // --------------------------------------------

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  numberOfHolidays?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  numberOfPermissions?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  remainingNumberOfHolidays?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  remainingNumberOfPermissions?: number;
}

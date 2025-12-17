import { Type } from "class-transformer";
import {
  IsArray,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested
} from "class-validator";
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

  // --------------------------------------------
  //  NUOVI CAMPI ORARI TEORICI
  // --------------------------------------------

  @IsOptional()
  @IsString()
  startTime: string;    // esempio: "08:30:00"

  @IsOptional()
  @IsString()
  endTime: string;      // esempio: "17:30:00"

  @IsOptional()
  @IsNumber()
  numberOfHolidays: number = 0;

  @IsOptional()
  @IsNumber()
  numberOfPermissions: number = 0;

  @IsOptional()
  @IsNumber()
  remainingNumberOfHolidays: number = 0;

  @IsOptional()
  @IsNumber()
  remainingNumberOfPermissions: number = 0;
}

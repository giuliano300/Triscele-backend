import { Type } from "class-transformer";
import { IsArray, IsEmail, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { PermissionDto } from "./permission.dto";

export class UpdateOperatorDto {

  @IsOptional()
  @IsString()
  businessName: string;
  
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

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
  @IsString()
  lunchStart: string;   // esempio: "13:00:00"

  @IsOptional()
  @IsString()
  lunchEnd: string;     // esempio: "14:00:00"
}

import { Type } from "class-transformer";
import { IsArray, IsEnum, IsOptional, IsString, ValidateNested } from "class-validator";
import { ProductUpDto } from "./productUp.dto";
import { OptionType } from "src/enum/enum";

export class OptionChildDto {

  @IsString()
  _id: string;

  @IsString()
  name: string;

  @IsEnum(OptionType)
  optionType: OptionType;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProductUpDto)
  products?: ProductUpDto[];

  // 🔥 RICORSIVO (IMPORTANTISSIMO)
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => OptionChildDto)
  children?: OptionChildDto[];
}
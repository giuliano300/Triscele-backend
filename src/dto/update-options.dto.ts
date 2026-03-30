import { Type } from "class-transformer";
import { IsArray, IsEnum, IsOptional, IsString, ValidateNested } from "class-validator";
import { ProductUpDto } from "./productUp.dto";
import { OptionType } from "src/enum/enum";
import { OptionChildDto } from "./option-child.dto";

export class UpdateOptionsDto {

  @IsString()
  name: string;

  @IsEnum(OptionType)
  optionType: OptionType;

  @IsString()
  layer: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductUpDto)
  products: ProductUpDto[]

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => OptionChildDto)
  children?: OptionChildDto[];
}
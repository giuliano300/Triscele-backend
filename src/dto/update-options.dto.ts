import { Type } from "class-transformer";
import { IsArray, IsEnum, IsString, ValidateNested } from "class-validator";
import { ProductUpDto } from "./productUp.dto";
import { OptionType } from "src/enum/enum";

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
}
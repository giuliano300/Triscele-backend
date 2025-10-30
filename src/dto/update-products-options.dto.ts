import { Type } from "class-transformer";
import { IsArray, IsEnum, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";
import { ProductUpDto } from "./productUp.dto";
import { ProductOptionsDto } from "./product-options.dto";
import { OptionType } from "src/enum/enum";

export class UpdateProductsOptionsDto {

  @IsString()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductUpDto)
  products: ProductUpDto[]

  @IsEnum(OptionType)
  optionType: OptionType;

  @IsString()
  layer: string;
  
  @IsObject()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProductOptionsDto)
  parent?: ProductOptionsDto;

  @IsOptional()
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => ProductUpDto)
  parentProduct: ProductUpDto

}
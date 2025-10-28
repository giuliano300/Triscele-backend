import { Type } from "class-transformer";
import { IsArray, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";
import { ProductUpDto } from "./productUp.dto";
import { ProductOptionsDto } from "./product-options.dto";

export class CreateProductsOptionsDto {

  @IsString()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductUpDto)
  products: ProductUpDto[]

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
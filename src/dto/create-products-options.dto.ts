import { Type } from "class-transformer";
import { IsArray, IsOptional, IsString, ValidateNested } from "class-validator";
import { ProductUpDto } from "./productUp.dto";

export class CreateProductsOptionsDto {

  @IsString()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductUpDto)
  products: ProductUpDto[]

  @IsString()
  @IsOptional()
  parentId?: string;

  @IsString()
  @IsOptional()
  parentProductId?: string;

}
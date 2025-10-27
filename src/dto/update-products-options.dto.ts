import { Type } from "class-transformer";
import { IsArray, IsOptional, IsString, ValidateNested } from "class-validator";
import { Product } from "src/schemas/product.schema";

export class UpdateProductsOptionsDto {

  @IsString()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Product)
  products: Product[]

  @IsString()
  @IsOptional()
  parentId?: string;

  @IsString()
  @IsOptional()
  parentProductId?: string;

}
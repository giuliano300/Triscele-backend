import { Type } from "class-transformer";
import { IsArray, IsString, ValidateNested } from "class-validator";
import { ProductUpDto } from "./productUp.dto";

export class UpdateOptionsDto {

  @IsString()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductUpDto)
  products: ProductUpDto[]
}
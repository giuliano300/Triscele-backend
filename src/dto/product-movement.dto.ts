import { IsNumber, IsString } from "class-validator";

export class ProductMovementsDto {
  @IsNumber()
  movementType: number;

  @IsNumber()
  stock: number;

  @IsString()
  productId: string;
}

import { IsNumber, IsOptional, IsString } from "class-validator";

export class ProductMovementsDto {
  @IsNumber()
  movementType: number;

  @IsNumber()
  stock: number;

  @IsString()
  productId: string;

  @IsOptional()
  @IsString()
  supplierId?: string;

  @IsOptional()
  @IsString()
  supplierName?: string;
  
  @IsOptional()
  @IsString()
  supplierCode?: string;
  
}

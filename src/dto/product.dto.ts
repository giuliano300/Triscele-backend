import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ProductOptions } from 'src/interfaces/productOptions';
import { SubProducts } from 'src/interfaces/subProduct';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  categoryId: string;

  @IsNumber()
  theshold: number;

  @IsNumber()
  price: number;

  @IsNumber()
  cost: number;

  @IsNumber()
  stock: number;

  @IsBoolean()
  enabled: boolean;

  @IsString()
  stock_type: string;

  @IsString()
  supplierCode: string;

  @IsString()
  supplierId: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  files?: unknown[];

  @IsOptional()
  subProducts?: SubProducts[];

  @IsOptional()
  options?: ProductOptions[];

  @IsOptional()
  @IsString()
  purchasePackage?: string;

  @IsOptional()
  @IsBoolean()
  isNew?: boolean;

}

export class UpdateProductDto extends CreateProductDto {}

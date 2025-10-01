import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  internalCode: string;

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
  @IsString()
  amazonCode?: string;

  @IsOptional()
  @IsString()
  ebayCode?: string;

  @IsOptional()
  @IsString()
  wcCode?: string;

  @IsOptional()
  @IsString()
  manomanoCode?: string;
}

export class UpdateProductDto extends CreateProductDto {}

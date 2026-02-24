import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProductUpDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @Type(() => Number) 
  @IsNumber()
  price: number;

  @IsString()
  @IsNotEmpty()
  stock_type: string;

  @Type(() => Number) 
  @IsNumber()
  quantity: number;

  @Type(() => Boolean) 
  @IsBoolean()
  selected: boolean;

}

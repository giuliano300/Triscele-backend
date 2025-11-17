import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

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

}

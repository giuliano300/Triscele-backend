import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProductUpDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;


}

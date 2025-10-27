import { IsNotEmpty, IsString } from 'class-validator';

export class ProductUpDto {
  @IsString()
  @IsNotEmpty()
  name: string;


}

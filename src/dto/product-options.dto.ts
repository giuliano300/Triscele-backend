import { IsString, IsOptional } from 'class-validator';

export class ProductOptionsDto {
  @IsOptional()
  @IsString()
  _id?: string;

  @IsString()
  name: string;
}

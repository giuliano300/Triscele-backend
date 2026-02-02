import { IsString } from 'class-validator';

export class SectorDto {

  @IsString()
  name: string;

  @IsString()
  description: string;
}

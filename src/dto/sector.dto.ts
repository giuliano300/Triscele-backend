import { IsString } from 'class-validator';

export class SectorDto {

  @IsString()
  name: string;

  @IsString()
  id: string;

  @IsString()
  description: string;
}

import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateSpaceDto {
  @ApiProperty({ example: 'Sala Yoga', description: 'Nome dello spazio' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Spazio per yoga e meditazione', description: 'Descrizione dello spazio' })
  @IsString()
  description: string;

  @ApiProperty({ example: 20, description: 'Prezzo orario in euro' })
  @IsNumber()
  hourlyRate: number;

  @ApiProperty({ example: true, description: 'Disponibilità dello spazio', required: false })
  @IsOptional()
  isAvailable?: boolean;
}

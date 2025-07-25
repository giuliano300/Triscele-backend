import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateBookingDto {
  @ApiProperty({ description: 'Id dello spazio' })
  @IsString()
  spaceId: string;

  @ApiProperty({ example: '2030-01-01', description: 'data della prenotazione' })
  @IsString()
  date: string;

  @ApiProperty({ example: '12:00', description: 'orario di inizio della prenotazione' })
  @IsString()
  startTime: string;

  @ApiProperty({ example: '14:00', description: 'orario di fine della prenotazione' })
  @IsString()
  endTime: string;
}
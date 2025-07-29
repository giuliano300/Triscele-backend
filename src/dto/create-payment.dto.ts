import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsEnum, IsOptional, IsMongoId } from 'class-validator';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty({ example: '68837c189e947dcd756b8cde', description: 'Id della prenotazione' })
  bookingId: string;

  @IsNumber()
  @ApiProperty({ example: '12', description: 'Costo della prenotazione' })
  amount: number;

  @IsEnum(['PENDING', 'PAID', 'FAILED'])
  @ApiProperty({ example: 'PAID', description: 'Esito della prenotazione' })
  status: 'PENDING' | 'PAID' | 'FAILED';

  @IsNotEmpty()
  @ApiProperty({ example: 'CREDIT CARD', description: 'Tipo di pagamento della prenotazione' })
  method: string;

  @IsOptional()
  @ApiProperty({ example: '000000000000', description: 'id della transazione della prenotazione' })
  transactionId?: string;
}

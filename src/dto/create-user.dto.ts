import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '../roles/roles.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Mario Rossi', description: 'Nome utente' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'mario.rossi@gmail.com', description: 'Email utente' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456', description: 'Password utente, minimo 6 caratteri' })
  @IsString()
  @MinLength(6)
  password: string;
  
  @ApiProperty({ example: 'cliente', description: 'Ruolo utente' })
  @IsString()
  @IsOptional()
  role?: UserRole;
}
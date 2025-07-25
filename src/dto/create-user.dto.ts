import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '../roles/roles.decorator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
  
  @IsString()
  @IsOptional()
  role?: UserRole;
}
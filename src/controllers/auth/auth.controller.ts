import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../../dto/create-user.dto';
import { LoginDto } from '../../dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) 
      return null;
   
    return this.authService.login(user);
  }

  @Post('loginOperator')
  async loginOperator(@Body() loginDto: LoginDto) {
    const operator = await this.authService.validateOperator(loginDto.email, loginDto.password);
    if (!operator) 
      return null;
   
    return this.authService.loginOperator(operator);
  }
  @Post('loginCustomer')
  async loginCustomer(@Body() loginDto: LoginDto) {
    const c = await this.authService.validateCustomer(loginDto.email, loginDto.password);
    if (!c) 
      return null;
   
    return this.authService.loginCustomer(c);
  }
}

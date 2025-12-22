import { Controller, Post, Body, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../../dto/create-user.dto';
import { LoginDto } from '../../dto/login.dto';
import { AllowedIpService } from 'src/services/allowed-ip.service';
import { LoginType } from 'src/enum/enum';
import { OperatorService } from 'src/services/operators.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private allowedIpService: AllowedIpService, 
    private operatorService: OperatorService
  ) {}

  private normalizeIp(ip: string) {
    return ip?.replace(/^::ffff:/, '');
  }

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
      return {success: false, message: 'Operatore non trovato con queste credenziali.'};

    //let clientIp =
      //req.headers['x-forwarded-for']?.toString().split(',')[0] ||
      //req.socket.remoteAddress;

    //if (operator.loginType === LoginType.onSite) 
    //{
      //const allowedIps = await this.allowedIpService.findAll();
      //clientIp = this.normalizeIp(clientIp!);
      //const isAllowed = allowedIps.some(a => a.ip === clientIp);

      //if (!isAllowed)
        //return {success: false, message: 'L\' ip di connessione non è consentito.'};
    //}
   
    return this.authService.loginOperator(operator);
  }

  @Post('loginCustomer')
  async loginCustomer(@Body() loginDto: LoginDto) {
    const c = await this.authService.validateCustomer(loginDto.email, loginDto.password);
    if (!c) 
      return null;
   
    return this.authService.loginCustomer(c);
  }

  @Post('ping')
  async ping(@Query('operatorId') operatorId: string, @Query('ip') ip: string) {
    const operator = await this.operatorService.find(operatorId);

    if (!operator) return "Nessun";

    if (operator.loginType === LoginType.onSite) 
    {
      const allowedIps = await this.allowedIpService.findAll();
      const isAllowed = allowedIps.some(a => a.ip === ip);

      if (!isAllowed) return false;
    }

    return true;
  }
}

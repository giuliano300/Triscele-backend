/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../services/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../../dto/create-user.dto';
import { User } from 'src/schemas/user.schema';
import { UserDto } from 'src/dto/user.dto';
import { OperatorService } from 'src/services/operators.service';
import { CustomerService } from 'src/services/customers.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private operatorService: OperatorService,
    private jwtService: JwtService,
    private customerService: CustomerService
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password))
      return user;

    return null;
  }

  async loginOperator(o: any) {
    const payload = { 
      success: true,
      username: o.email, 
      name: o.businessName, 
      sub: o.id, 
      role: 'operator', 
      sectorId: o.sectorId,
      permission: o.permissions 
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async loginCustomer(o: any) {
    const payload = { 
      username: o.email, 
      name: o.businessName, 
      sub: o.id, 
      role: 'customer',
      c: o
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

   async validateOperator(email: string, password: string): Promise<any | null> {
    const o = await this.operatorService.findByEmailPwd(email, password);
    if (o)
      return o;
      
    return null;
  }

   async validateCustomer(email: string, password: string): Promise<any | null> {
    const o = await this.customerService.findByEmailPwd(email, password);
    if (o)
      return o;
      
    return null;
  }

  async login(user: Partial<UserDto>) {
    const payload = { username: user.email, name: user.name, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

 async register(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    return this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });
  }
}

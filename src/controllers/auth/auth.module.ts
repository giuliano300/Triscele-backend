import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './jwt.strategy';
import { OperatorsModule } from '../Operator/operators.module';
import { CustomersModule } from '../Customers/customers.module';
import { AllowedIpModule } from '../Allowed-ip/allowed-ip.module';

@Module({
  imports: [
    UsersModule,
    OperatorsModule,
    CustomersModule,
    AllowedIpModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'a-string-secret-at-least-256-bits-long',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}

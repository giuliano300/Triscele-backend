import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AllowedIpController } from './allowed-ip.controller';
import { AllowedIpService } from 'src/services/allowed-ip.service';
import { AllowedIp, AllowedIpSchema } from 'src/schemas/allowed-ip.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AllowedIp.name, schema: AllowedIpSchema },
    ]),
  ],
  controllers: [AllowedIpController],
  providers: [AllowedIpService],
  exports: [AllowedIpService],
})
export class AllowedIpModule {}

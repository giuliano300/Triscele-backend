import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {  IllnessController } from './illness.controller';
import { Illness, IllnessSchema } from 'src/schemas/illness.schema';
import { IllnessService } from 'src/services/illness.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Illness.name, schema: IllnessSchema }]),
  ],
  controllers: [IllnessController],
  providers: [IllnessService],
})
export class IllnessModule {}

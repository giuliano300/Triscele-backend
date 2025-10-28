import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OptionsService } from 'src/services/options.service';
import { OptionsController } from './Options.controller';
import { Options, OptionsSchema } from 'src/schemas/options.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Options.name, schema: OptionsSchema }])],
  providers: [OptionsService],
  controllers: [OptionsController],
})
export class OptionsModule {}

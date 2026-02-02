import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Sector, SectorSchema } from 'src/schemas/sector.schema';
import { SectorsService } from 'src/services/sectors.service';
import { SectorController } from './sectors.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Sector.name, schema: SectorSchema }]),
  ],
  controllers: [SectorController],
  providers: [SectorsService],
})
export class SectorModule {}

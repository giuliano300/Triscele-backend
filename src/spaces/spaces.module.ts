import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SpacesService } from '../services/spaces.service';
import { SpacesController } from './spaces.controller';
import { Space, SpaceSchema } from '../schemas/space.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Space.name, schema: SpaceSchema }]),
  ],
  controllers: [SpacesController],
  providers: [SpacesService],
})
export class SpacesModule {}

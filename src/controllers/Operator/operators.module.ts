import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OperatorService } from '../../services/operators.service';
import { OperatorController } from './operators.controller';
import { Operator, OperatorSchema } from '../../schemas/operators.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Operator.name, schema: OperatorSchema }]),
  ],
  controllers: [OperatorController],
  providers: [OperatorService],
})
export class OperatorsModule {}

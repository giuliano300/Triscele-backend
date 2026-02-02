import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from '../../services/users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from '../../schemas/user.schema';
import { EmailModule } from 'src/modules/email.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), EmailModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // 👈 serve per AuthModule
})
export class UsersModule {}

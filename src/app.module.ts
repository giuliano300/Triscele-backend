import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SpacesModule } from './spaces/spaces.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AppService } from './app.service';
import { BookingsModule } from './booking/booking.module';
import { CourseBookingModule } from './course-booking/course-booking.module';
import { CoursesModule } from './courses/courses.module';
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/centro-db'),
    SpacesModule,
    AuthModule,
    UsersModule,
    BookingsModule,
    CoursesModule,
    CourseBookingModule
  ],
  controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}

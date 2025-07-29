import { Test, TestingModule } from '@nestjs/testing';
import { CourseBookingsController } from './course-booking.controller';

describe('CourseBookingsController', () => {
  let controller: CourseBookingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseBookingsController],
    }).compile();

    controller = module.get<CourseBookingsController>(CourseBookingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

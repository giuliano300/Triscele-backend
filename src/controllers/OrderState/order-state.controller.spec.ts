import { Test, TestingModule } from '@nestjs/testing';
import { OrderStateController } from './order-state.controller';

describe('OrderStateController', () => {
  let controller: OrderStateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderStateController],
    }).compile();

    controller = module.get<OrderStateController>(OrderStateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

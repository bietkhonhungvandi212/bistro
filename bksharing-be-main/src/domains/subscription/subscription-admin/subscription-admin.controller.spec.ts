import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionAdminController } from './subscription-admin.controller';
import { SubscriptionAdminService } from './subscription-admin.service';

describe('SubscriptionAdminController', () => {
  let controller: SubscriptionAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionAdminController],
      providers: [SubscriptionAdminService],
    }).compile();

    controller = module.get<SubscriptionAdminController>(SubscriptionAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { DashboardClientController } from './dashboard-client.controller';
import { DashboardClientService } from './dashboard-client.service';

describe('DashboardClientController', () => {
  let controller: DashboardClientController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardClientController],
      providers: [DashboardClientService],
    }).compile();

    controller = module.get<DashboardClientController>(DashboardClientController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

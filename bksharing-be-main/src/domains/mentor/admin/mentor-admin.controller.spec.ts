import { Test, TestingModule } from '@nestjs/testing';
import { MentorAdminController } from './mentor-admin.controller';
import { MentorAdminService } from './mentor-admin.service';

describe('MentorAdminController', () => {
  let controller: MentorAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MentorAdminController],
      providers: [MentorAdminService],
    }).compile();

    controller = module.get<MentorAdminController>(MentorAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { CourseAdminController } from './course-admin.controller';
import { CourseAdminService } from './course-admin.service';

describe('CourseAdminController', () => {
  let controller: CourseAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseAdminController],
      providers: [CourseAdminService],
    }).compile();

    controller = module.get<CourseAdminController>(CourseAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { CourseAdminService } from './course-admin.service';

describe('CourseAdminService', () => {
  let service: CourseAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourseAdminService],
    }).compile();

    service = module.get<CourseAdminService>(CourseAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { CourseClientService } from './course-client.service';

describe('CourseClientService', () => {
  let service: CourseClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourseClientService],
    }).compile();

    service = module.get<CourseClientService>(CourseClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

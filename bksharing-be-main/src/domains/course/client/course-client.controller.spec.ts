import { Test, TestingModule } from '@nestjs/testing';
import { CourseClientController } from './course-client.controller';
import { CourseClientService } from './course-client.service';

describe('CourseClientController', () => {
  let controller: CourseClientController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseClientController],
      providers: [CourseClientService],
    }).compile();

    controller = module.get<CourseClientController>(CourseClientController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

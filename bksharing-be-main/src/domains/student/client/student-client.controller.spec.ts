import { Test, TestingModule } from '@nestjs/testing';
import { StudentClientController } from './student-client.controller';
import { StudentClientService } from './student-client.service';

describe('StudentClientController', () => {
  let controller: StudentClientController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentClientController],
      providers: [StudentClientService],
    }).compile();

    controller = module.get<StudentClientController>(StudentClientController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { GetstreamService } from './getstream.service';

describe('GetstreamService', () => {
  let service: GetstreamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GetstreamService],
    }).compile();

    service = module.get<GetstreamService>(GetstreamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

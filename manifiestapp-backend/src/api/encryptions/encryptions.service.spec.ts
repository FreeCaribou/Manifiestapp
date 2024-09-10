import { Test, TestingModule } from '@nestjs/testing';
import { EncryptionsService } from './encryptions.service';

describe('EncryptionsService', () => {
  let service: EncryptionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EncryptionsService],
    }).compile();

    service = module.get<EncryptionsService>(EncryptionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { VariantsController } from './variants.controller';
import { VariantsService } from './variants.service';

describe('VariantsController', () => {
  let controller: VariantsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VariantsController],
      providers: [VariantsService],
    }).compile();

    controller = module.get<VariantsController>(VariantsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

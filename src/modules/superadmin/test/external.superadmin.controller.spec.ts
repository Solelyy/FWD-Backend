import { Test, TestingModule } from '@nestjs/testing';
import { ExternalSuperadminController } from '../controller/external.superadmin.controller';

describe('ExternalSuperadminController', () => {
  let controller: ExternalSuperadminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExternalSuperadminController],
    }).compile();

    controller = module.get<ExternalSuperadminController>(
      ExternalSuperadminController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

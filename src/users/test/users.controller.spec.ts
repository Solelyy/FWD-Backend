import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../controller/users.controller';
import { UsersService } from '../service/users.service';
import { PrismaModule } from 'src/prisma_global/prisma.module';
import SecurityUtil from 'src/utils/security/bcrypt';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [UsersController],
      providers: [UsersService, SecurityUtil],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

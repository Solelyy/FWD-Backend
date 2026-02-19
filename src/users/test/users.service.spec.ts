import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../../prisma_global/prisma.service';
import { UsersService } from '../service/users.service';
import { UsersController } from '../controller/users.controller';
import { PrismaModule } from '../../prisma_global/prisma.module';
import { CreateUserDto } from '../dto/create-user.dto';
import SecurityUtil from 'src/utils/security/bcrypt';

describe('UsersService (Integration with Real DB)', () => {
  //declare di thats gonna be used in testing module
  let app: INestApplication;
  let service: UsersService;
  let prisma: PrismaService;
  let bcrypt: SecurityUtil;

  beforeAll(async () => {
    //run this code before starting
    const moduleRef = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [UsersService, SecurityUtil],
      controllers: [UsersController],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init(); //bootstrap module

    //store
    service = moduleRef.get<UsersService>(UsersService);
    prisma = moduleRef.get<PrismaService>(PrismaService);
    bcrypt = moduleRef.get<SecurityUtil>(SecurityUtil);
  });

  beforeEach(async () => {
    //run this code before each tests
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    //run the code after all tests are done
    await prisma.$disconnect();
    await app.close();
  });

  describe('create()', () => {
    it('should create a new user in the database', async () => {
      //create mock data
      const createUserDto: CreateUserDto = {
        firstname: 'mang kepweng',
        lastname: 'hoho',
        employeeId: '34634364736643764374',
        email: 'samplehaha@.com',
        passwordHash: 'strongpasswordshi',
      };
      const result = await service.createUser(createUserDto);
      expect(result).toBeDefined();
      expect(result).not.toHaveProperty('id');
      expect(result).not.toHaveProperty('passwordHash');
      expect(result).toMatchObject({
        firstname: 'mang kepweng',
        lastname: 'hoho',
        employeeId: '34634364736643764374',
        email: 'samplehaha@.com',
      });

      const dbUser = await prisma.user.findUnique({
        where: { email: 'samplehaha@.com' },
      });
      expect(dbUser).toBeDefined();
      expect(dbUser?.email).toBe('samplehaha@.com');
    });

    it('should throw an error when creating duplicate email', async () => {
      const createUserDto: CreateUserDto = {
        firstname: 'mang kepweng',
        lastname: 'hoho',
        employeeId: '34634364736643764374',
        email: 'samplehaha@.com',
        passwordHash: 'strongpasswordshi',
      };
      await service.createUser(createUserDto);

      const duplicateDto: CreateUserDto = {
        firstname: 'mang kepweng',
        lastname: 'hoho',
        employeeId: '34634364736643764374',
        email: 'samplehaha@.com',
        passwordHash: 'strongpasswordshi',
      };

      await expect(service.createUser(duplicateDto)).rejects.toThrow();
    });
  });

  // current endpoint
  describe('HTTP Endpoints', () => {
    it('/POST users (with real DB)', async () => {
      const createUserDto: CreateUserDto = {
        firstname: 'http',
        lastname: 'user',
        employeeId: 'HTTP123456',
        email: 'samplehaha@.com',
        passwordHash: 'httppassword',
      };

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201);

      expect(response.body).toBeDefined();
      expect(response.body).not.toHaveProperty('id');
      expect(response.body).not.toHaveProperty('passwordHash');
      expect(response.body).toMatchObject({
        firstname: 'http',
        lastname: 'user',
        employeeId: 'HTTP123456',
        email: 'samplehaha@.com',
      });

      const dbUser = await prisma.user.findUnique({
        where: { email: 'samplehaha@.com' },
      });
      expect(dbUser).toBeDefined();
      expect(dbUser?.email).toBe('samplehaha@.com');
      expect(dbUser?.firstname).toBe('http');
    });
  });
});

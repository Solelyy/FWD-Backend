import env from 'dotenv';
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

//allows to be a dependency injection
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private node_env: string;

  constructor() {
    const environment = process.env.NODE_ENV || 'development';
    const path = `.env.${environment}`;

    env.config({ path: path });

    const { NODE_ENV } = process.env;

    const connectionString = `${process.env.DATABASE_URL}`;
    const adapter = new PrismaPg({ connectionString });

    super({ adapter });

    console.log('using prisma at:', NODE_ENV);
  }

  //the connect, disconnect and trnsacrion belongs
  //to parent PrismaClient since PrismaService inherits
  async onModuleInit() {
    try {
      await this.$connect();
      console.log('db connected');
    } catch (e) {
      console.log('error at:', e.message);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('db disconnected');
  }

  async executeTransaction<T>(
    fn: (prisma: PrismaClient) => Promise<T>,
  ): Promise<T> {
    return this.$transaction(fn);
  }
}

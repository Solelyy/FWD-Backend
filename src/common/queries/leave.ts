import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma_global/prisma.service';

@Injectable()
export class LeaveQuery {
  constructor(private readonly prisma: PrismaService) {}

  async createLeave<T>(model: string, data: any): Promise<T> {
    return this.prisma[model].create({ data: data });
  }
}

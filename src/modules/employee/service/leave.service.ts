import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma_global/prisma.service';

@Injectable()
export class LeaveService {
  constructor(private readonly prisma: PrismaService) {}

  async createLeave (){
    
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma_global/prisma.service';
import { EmployeeLeaveDTO } from '../dto/create-leave';

@Injectable()
export class LeaveService {
  constructor(private readonly prisma: PrismaService) {}

  async createLeave(employee: EmployeeLeaveDTO) {
    let leaveBalanceDays: number = 6;
    let sickLeaveBalDays: number = 6;

    const leave = await this.prisma.tb
  }
}

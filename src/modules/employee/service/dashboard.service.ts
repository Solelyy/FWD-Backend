import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma_global/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async acceptDataPolicy(employeeId: string) {
    const update = await this.prisma.user.update({
      where: { employeeId: employeeId },
      data: {
        isDataPolicyAccepted: true,
      },
    });

    return {
      id: update.id,
      employeeId: update.employeeId,
      firstname:update.firstname,
      lastname: update.lastname,
      role: update.role,
      email: update.email,
      isDataPolicyAccepted: update.isDataPolicyAccepted
    }
  }
}

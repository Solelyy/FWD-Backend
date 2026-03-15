import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma_global/prisma.service';
import { Role } from '@prisma/client';
@Injectable()
export class AttendanceServiceFeature {
  constructor(private readonly prisma: PrismaService) {}

  async viewAdmins() {
    // refer to crud operations at prisma orm queries
    // to filterize a wuery use where, but to select some attributes within the filter use
    // select
    const allAdmins = await this.prisma.user.findMany({
      where: { role: Role.ADMIN },
      select: {
        employeeId: true,
        firstname: true,
        lastname: true,
        email: true,
        status: true,
        invitationDate: true,
      },
    });

    return allAdmins;
  }
}

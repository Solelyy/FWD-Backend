import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma_global/prisma.service';
import { Role } from '@prisma/client';
import { AdminStatusDTO } from '../dto/admin.status.dto';
import { AdminStatusSuspendedDTO } from '../dto/admin.status.suspended.dto';
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
        role: true
      },
    });

    return allAdmins;
  }

  async updateStatus(admin: AdminStatusDTO) {
    const user = await this.prisma.user.findFirst({
      where: { employeeId: admin.employeeId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const update = await this.prisma.user.update({
      where: { employeeId: admin.employeeId },
      data: {
        status: admin.status,
      },
    });

    return update.status;
  }

  async setStatusSuspended(employeeId: string, admin: AdminStatusSuspendedDTO) {
    const date = new Date();
    const user = await this.prisma.user.findFirst({
      where: { employeeId: employeeId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const startDate = new Date(admin.startDate);
    const endDate = new Date(admin.endDate);

    const update = await this.prisma.user.update({
      where: { employeeId: employeeId },
      data: {
        startDate: startDate,
        endDate: endDate,
        status: admin.status,
      },
    });

    return {
      status: update.status,
      startDate: update.startDate,
      endDate: update.endDate,
    };
  }

  async softDelete(email: string){
    const user = await this.prisma.user.findFirst({
      where: {
        email: email
      }
    })

    if(!user){
      throw new NotFoundException("User does not exists")
    }

    await this.prisma.user.update({
      where: {
        email: user.email
      },
      data: {
        isDeleted: true
      }
    })
  }
}

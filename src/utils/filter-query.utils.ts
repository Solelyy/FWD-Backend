import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdminFilterInterface } from 'src/modules/superadmin/interface/createadmin-user.interface';
import { ConflictException } from '@nestjs/common';
@Injectable()
export class FilterQueryHelper {
  filterQuery(
    exists: CreateAdminFilterInterface,
    database: CreateAdminFilterInterface,
  ) {
    if (exists.email === database?.email) {
      throw new ConflictException('User with this email already exists');
    } else if (exists.employeeId === database?.employeeId) {
      throw new ConflictException('User with this employeeId already exists');
    } else if (!exists.email || !exists.employeeId) {
      throw new NotFoundException('missing data');
    }
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
  BadRequestException,
  Req,
  NotFoundException,
} from '@nestjs/common';
import type { RequestData } from 'src/modules/auth/interface/reqdata';
import { CustomValidationPipe } from 'src/common/custom-pipes/pipes.custom-pipes';
import { CreateAdminUser } from '../dto/create-superadmin.dto';
import { AuthGuard } from 'src/modules/auth/guard/auth.guard';
import { SuperAdminUsersService } from '../service/users-superadmin.service';
import type { Response } from 'express';
import { CookieHelper } from 'src/utils/cookie';
import { Roles } from 'src/common/custom-decorators/Roles.decorator';
import { RolesGuard } from 'src/modules/auth/guard/roles.guard';
@Controller('users')
export class SuperadminController {
  constructor(
    private readonly sAdmin: SuperAdminUsersService,
    private readonly cookie: CookieHelper,
  ) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @Post('create-admin-account')
  async create(@Body(CustomValidationPipe) createUser: CreateAdminUser) {
    const result = await this.sAdmin.createUserAdmin(createUser);

    //token is one time no need for cookie since its public
    if (!result.verificationToken) {
      throw new BadRequestException('Verification token is required');
    }

    return {
      data: {
        success: true,
        message: 'user invited',
      },
    };
  }

  @Patch('superadmin-data-policy')
  @Roles('SUPER_ADMIN')
  @UseGuards(AuthGuard, RolesGuard)
  async setDataPolicy(@Req() req: RequestData) {
    const data = req.user?.employeeId;

    if (!data) {
      throw new NotFoundException('User not found');
    }

    const update = await this.sAdmin.acceptDataPolicy(data);

    return {
      success: true,
      message: 'data policy accepted',
      id: update.id,
      employeeId: update.employeeId,
      firstname:update.firstname,
      lastname: update.lastname,
      role: update.role,
      email: update.email,
      isDataPolicyAccepted: update.isDataPolicyAccepted
    };
  }
}

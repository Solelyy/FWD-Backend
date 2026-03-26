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
} from '@nestjs/common';

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
}

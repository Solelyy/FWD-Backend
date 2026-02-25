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

@Controller('users')
export class SuperadminController {
  constructor(
    private readonly sAdmin: SuperAdminUsersService,
    private readonly cookie: CookieHelper,
  ) {}

  @Post('create-admin-account')
  @UseGuards(AuthGuard)
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

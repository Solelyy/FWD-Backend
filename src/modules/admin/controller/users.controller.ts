import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from '../service/admin.service';
import { CreateUserDto } from '../dto/create-admin.dto';
import { UpdateUserDto } from '../dto/update-admin.dto';
import { CustomValidationPipe } from 'src/common/custom-pipes/pipes.custom-pipes';
import { RolesGuard } from 'src/modules/auth/guard/roles.guard';
import { AuthGuard } from 'src/modules/auth/guard/auth.guard';
import { Roles } from 'src/common/custom-decorators/Roles.decorator';
import type { RequestData } from 'src/modules/auth/interface/reqdata';
@Controller('users') //this is the parent path
export class AdminController {
  constructor(private readonly AdminService: AdminService) {}

  @Roles('ADMIN')
  @UseGuards(AuthGuard, RolesGuard)
  @Post('create-employee-account')
  async create(@Body(CustomValidationPipe) createUserDto: CreateUserDto) {
    const response = await this.AdminService.createUser(createUserDto);

    return {
      success: true,
      message: 'invitation sent successfully',
    };
  }

  @Post('admin-data-policy')
  @Roles('ADMIN')
  @UseGuards(AuthGuard, RolesGuard)
  async setDataPolicy(@Req() req: RequestData) {
    const data = req.user?.employeeId;

    if (!data) {
      throw new NotFoundException('User not found');
    }

    await this.AdminService.acceptDataPolicy(data);

    return {
      success: true,
      message: 'data policy accepted',
    };
  }
}

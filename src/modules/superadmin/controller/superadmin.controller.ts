import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { CustomValidationPipe } from 'src/common/custom-pipes/pipes.custom-pipes';
import { CreateAdminUser } from '../dto/create-superadmin.dto';
import { AuthGuard } from 'src/modules/auth/guard/auth.guard';
import { SuperAdminUsersService } from '../service/users-superadmin.service';

@Controller('users')
export class SuperadminController {
  constructor(private readonly sAdmin: SuperAdminUsersService) {}

  @Post('create-admin-account')
  @UseGuards(AuthGuard)
  async create(@Body(CustomValidationPipe) createUser: CreateAdminUser) {
    await this.sAdmin.createUserAdmin(createUser);

    return {
      data: {
        success: true,
        message: 'user invited',
      },
    };
  }

  @Get()
  findAll() {
    return this.sAdmin.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sAdmin.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSuperadminDto) {
    //return this.sAdmin.update(+id, updateSuperadminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sAdmin.remove(+id);
  }
}

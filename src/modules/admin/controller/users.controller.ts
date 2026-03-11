import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AdminService } from '../service/admin.service';
import { CreateUserDto } from '../dto/create-admin.dto';
import { UpdateUserDto } from '../dto/update-admin.dto';
import { CustomValidationPipe } from 'src/common/custom-pipes/pipes.custom-pipes';

@Controller('users') //this is the parent path
export class AdminController {
  constructor(private readonly AdminService: AdminService) {}

  @Post('create-employee-account')
  async create(@Body(CustomValidationPipe) createUserDto: CreateUserDto) {
    const response = await this.AdminService.createUser(createUserDto);

    return {
      success: true,
      message: 'invitation sent successfully',
    };
  }

  @Get()
  findAll() {}

  @Get(':id')
  findOne(@Param('id') id: string) {}

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.AdminService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.AdminService.remove(+id);
  }
}

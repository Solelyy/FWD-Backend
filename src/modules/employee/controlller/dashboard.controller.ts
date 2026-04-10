import {
  Controller,
  Patch,
  Post,
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from 'src/modules/auth/guard/auth.guard';
import { DashboardService } from '../service/dashboard.service';
import type { RequestData } from 'src/modules/auth/interface/reqdata';
import { RolesGuard } from 'src/modules/auth/guard/roles.guard';
import { Roles } from 'src/common/custom-decorators/Roles.decorator';
@Controller('employee')
export class DashboardController {
  constructor(private readonly service: DashboardService) {}

  @Patch('data-policy')
  @Roles('EMPLOYEE')
  @UseGuards(AuthGuard, RolesGuard)
  async setDataPolicy(@Req() req: RequestData) {
    const data = req.user?.employeeId;

    if (!data) {
      throw new NotFoundException('User not found');
    }

    await this.service.acceptDataPolicy(data);

    return {
      success: true,
      message: 'data policy accepted',
    };
  }
}

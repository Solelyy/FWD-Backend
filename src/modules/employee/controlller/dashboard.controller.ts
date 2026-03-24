import {
  Controller,
  Post,
  Query,
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from 'src/modules/auth/guard/auth.guard';
import { DashboardService } from '../service/dashboard.service';
import type { RequestData } from 'src/modules/auth/interface/reqdata';
@Controller('employee')
export class DashboardController {
  constructor(private readonly service: DashboardService) {}

  @Post('data-policy')
  @UseGuards(AuthGuard)
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

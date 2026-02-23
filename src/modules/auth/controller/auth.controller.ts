import {
  Body,
  Controller,
  NotFoundException,
  Req,
  Res,
  Post,
  Get,
  UseGuards,
} from '@nestjs/common';
import { LoginDto } from 'src/modules/auth/dto/login.dto';
import { AuthService } from '../service/auth.service';
import type { Response, Request } from 'express';
import { CookieHelper } from 'src/utils/cookie';
import { AuthGuard } from '../guard/auth.guard';
import request from 'supertest';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly user: AuthService,
    private readonly cookie: CookieHelper,
  ) {}

  @Post('login')
  async login(
    @Body() login: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    //no try catch since exception filters are already declare in superadmin sevice
    const resultWithToken = await this.user.userLogin(login);

    const { employeeId, role, authCurrentToken } = resultWithToken;

    if (!authCurrentToken) {
      throw new NotFoundException('no token');
    }
    //cookies are aumatically at response no eed to store
    this.cookie.setAuthCookies({ employeeId, role }, authCurrentToken, res);
    return {
      //rootpoints
      //accessed by response eg. res.token or res.data
      token: authCurrentToken,
      data: {
        success: true,
        message: 'logged in successfully',
      },
    };
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async getMe(@Req() res: Request) {
    const { token } = res as any;

    const sendToken = await this.user.getMe(token);

    return sendToken;
  }
}

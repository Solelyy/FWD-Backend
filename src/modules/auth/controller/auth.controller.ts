import { Body, Controller, NotFoundException, Res } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { LoginDto } from 'src/modules/auth/dto/login.dto';
import { AuthService } from '../service/auth.service';
import type { Response } from 'express';
import { CookieHelper } from 'src/utils/cookie';

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
      success: true,
      user: {
        employeeId,
        role,
      },
    };
  }
}

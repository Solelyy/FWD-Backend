import {
  Body,
  Controller,
  NotFoundException,
  Req,
  Res,
  Post,
  Get,
  UseGuards,
  Query,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { LoginDto } from 'src/modules/auth/dto/login.dto';
import { SetPasswordDto } from '../dto/setup-pass.dto';
import { AuthService } from '../service/auth.service';
import type { Response, Request } from 'express';
import { CookieHelper } from 'src/utils/cookie';
import { AuthGuard } from '../guard/auth.guard';
import { CustomValidationPipe } from 'src/common/custom-pipes/pipes.custom-pipes';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly user: AuthService,
    private readonly cookie: CookieHelper,
  ) {}

  @Post('login')
  async login(
    @Body(CustomValidationPipe) login: LoginDto,
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
      //rootpoints cna be accesed
      data: {
        success: true,
        message: 'logged in successfully',
      },
    };
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async getMe(@Req() req: Request) {
    const token = req.cookies?.['session_token'];

    const sendTokenService = await this.user.getMe(token);

    return sendTokenService;
  }

  @Post('verify-email/:token')
  //use query when a data is sent on the url eg. token=
  //only use request when directly from users
  async verifyEmail(
    @Param('token') token: string,
    @Body(CustomValidationPipe) password: SetPasswordDto,
  ) {
    if (!token) {
      throw new BadRequestException('invalid token');
    }
    const sendToken = await this.user.verifyEmailSetPassword(token, password);

    const { status } = sendToken;
    return {
      success: true,
      message: 'email verified successfully',
      isVerified: status,
    };
  }
}

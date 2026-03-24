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
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly user: AuthService,
    private readonly cookie: CookieHelper,
  ) {}

  // use guard if not set App_global in module for throttling
  @UseGuards(ThrottlerGuard)
  @Throttle({ login: { ttl: 900000, limit: 5 } })
  @Post('login')
  async login(
    @Body(CustomValidationPipe) login: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const resultWithToken = await this.user.userLogin(login);

    const { employeeId, role, session } = resultWithToken;

    if (!session) {
      throw new NotFoundException('no token');
    }
    //cookies are aumatically at response no eed to store
    this.cookie.setAuthCookies({ employeeId, role }, session, res);
    return {
      data: {
        user: resultWithToken,
        success: true,
        message: 'logged in successfully',
      },
    };
  }

  @Post('logout')
  // cookie deleted trhu response
  async logout(@Res({ passthrough: true }) res: Response) {
    this.cookie.clearAuthCookies(res);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async getMe(@Req() req: Request) {
    const token = req.cookies?.['session_token'];

    const sendTokenService = await this.user.getMe(token);

    return sendTokenService;
  }

  @Post('set-password')
  //use query when a data is sent on the url eg. token=
  //only use request when directly from users
  async verifyEmail(@Body(CustomValidationPipe) body: SetPasswordDto) {
    if (!body.token) {
      throw new BadRequestException('invalid token');
    }
    const sendToken = await this.user.setPassword(body.token, body);

    const { status } = sendToken;
    return {
      success: true,
      message: 'email verified successfully',
      isVerified: status,
    };
  }

  @Get('validate-token')
  async verifyToken(@Query('token') token: string) {
    const result = await this.user.verifyToken(token);

    return {
      message: 'token verified',
      success: 'true',
      employeeId: result,
    };
  }
}

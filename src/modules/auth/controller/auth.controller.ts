import { Body, Controller, HttpException, HttpStatus } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { LoginDto } from 'src/modules/auth/dto/login.dto';
import { AuthService } from '../service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly user: AuthService) {}

  @Post('login')
  async login(@Body() login: LoginDto) {
    //no try catch since exception filters are already declare in superadmin sevice
    const resultWithToken = await this.user.userLogin(login);
    return resultWithToken;
  }
}

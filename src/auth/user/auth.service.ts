import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/service/users.service';
import { CreateUserDto } from 'src/dto/users/create-user.dto';
import { JwtUtil } from 'src/utils/security/token.security';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
    private jwtUtil: JwtUtil,
    private emailService: EmailService,
  ) {}

  async createAcc(user: CreateUserDto) {
    const expiration = new Date();

    expiration.setMinutes(expiration.getMinutes() + 15);

    const createdUser = await this.userService.createUser({
      ...user,
      isVerified: false,
      verificationExpiration: expiration,
    });

    const token = this.jwtUtil.generateToken({
      email: createdUser.email,
      sub: createdUser.id,
      role: createdUser.role,
    });

    this.emailService.sendVerificationEmail(createdUser.email, token);
  }

  async verifyUser() {}
}

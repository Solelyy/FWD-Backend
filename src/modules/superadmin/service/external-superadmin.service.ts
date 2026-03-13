import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma_global/prisma.service';
import { EmailService } from 'src/email/service/email.service';
import { JwtUtil } from 'src/modules/auth/helper/token.security';

@Injectable()
export class ExternalService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly email: EmailService,
    private readonly jwt: JwtUtil,
  ) {}

  async resendEmail(userEmail: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: userEmail,
      },
    });

    if (!user) {
      throw new NotFoundException('User invalid or doesnt exists');
    }

    const token = this.jwt.verificationToken({
      email: user.email,
      sub: user.employeeId,
      role: user.role,
    });

    await this.email.sendVerificationEmail(userEmail, token);
  }
}

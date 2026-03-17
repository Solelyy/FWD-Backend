import { PrismaService } from 'src/prisma_global/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class DateHelper {
  constructor(private readonly prisma: PrismaService) {}

  async LocaleSetDateHelper(email: string, token: string) {
    const date = new Date();

    const setEmailCreationDate = date.toLocaleString('en-PH', {
      timeZone: 'Asia/Manila',
      dateStyle: 'full',
      timeStyle: 'medium',
    });

    try {
      const user = await this.prisma.user.update({
        where: {
          email: email,
        },
        data: {
          invitationDate: setEmailCreationDate,
          verificationToken: token,
        },
      });
    } catch (e) {
      throw new BadRequestException('User invalid or user not found');
    }
  }

  /*
  async SetDateHelper() {
    const date = new Date();

    const setEmailCreationDate = date.toLocaleString('en-PH', {
      timeZone: 'Asia/Manila',
      dateStyle: 'full',
      timeStyle: 'medium',
    });
  }
  */
}

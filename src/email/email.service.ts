import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
import env from 'dotenv';

const environment = process.env.NODE_ENV || 'development';
const envPath = `.env.${environment}`; //change the env value

env.config({ path: envPath });

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private FROM_NAME?: string;
  private FROM_EMAIL?: string;

  constructor() {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_KEY, FROM_NAME, FROM_EMAIL } =
      process.env;

    this.FROM_NAME = FROM_NAME;
    this.FROM_EMAIL = FROM_EMAIL;

    this.transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: false,
      auth: {
        user: SMTP_USER,
        pass: SMTP_KEY,
      },
    });
  }

  async sendVerificationEmail(to: string, token: string): Promise<void> {
    const verificationLink = `${process.env.APP_URL}/auth/verify-email?token=${token}`;

    const info = await this.transporter.sendMail({
      from: `"${this.FROM_NAME}" <${this.FROM_EMAIL}>`,
      to,
      subject: 'Verify Your Email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2>Welcome!</h2>
          <p>Click the link below to verify your email:</p>
          <a href="${verificationLink}" 
             style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
            Verify Email
          </a>
        </div>
      `,
    });
  }
}

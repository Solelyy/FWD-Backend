import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
import env from 'dotenv';
import { DateHelper } from 'src/utils/date.utils';

const environment = process.env.NODE_ENV || 'production';
const envPath = `.env.${environment}`; //change the env value

env.config({ path: envPath });

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private FROM_NAME?: string;
  private FROM_EMAIL?: string;
  private APP_URL?: string;
  private DEV_URL?: string;

  // inside the constructor runs the code everytime,
  // think of it as a bootstrap of the class
  constructor(private readonly date: DateHelper) {
    const {
      SMTP_HOST,
      SMTP_PORT,
      SMTP_USER,
      SMTP_KEY,
      FROM_NAME,
      FROM_EMAIL,
      APP_URL,
      DEV_URL,
    } = process.env;

    this.FROM_NAME = FROM_NAME;
    this.FROM_EMAIL = FROM_EMAIL;
    this.APP_URL = APP_URL;
    this.DEV_URL = DEV_URL;

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
    const verificationLink = `${this.APP_URL}/set-password?token=${token}`;

    const info = await this.transporter.sendMail({
      from: `"${this.FROM_NAME}" <${this.FROM_EMAIL}>`,
      to,
      subject: 'Activate Your FWD Portal Account',
      html: `
       <div style="font-family: Arial, sans-serif; max-width: 300px; margin: 0; padding: 20px;">
    <h2 style="margin: 0 0 16px 0; font-size: 20px; text-align: left;">Welcome to the FWD Portal! You have been invited to activate your account.</h2>
    
    <p style="margin: 0 0 18px 0; font-size: 16px; text-align: left;">To get started, please click the button below to <span style="font-weight: 700;">set your password and activate your account.</span></p>
    
    <div style="text-align: left; margin: 30px 0;">
        <a href="${verificationLink}" 
          style="display: inline-block; padding: 10px 20px; background-color: #FFEB94; color: black; text-decoration: none; border-radius: 5px; font-size: 16px;">
          Activate Account
        </a>
    </div>
    
    <p style="margin: 0 0 18px 0; font-size: 16px; text-align: left;">Once completed, you will be able to log in and access the portal.</p>
    
    <p style="margin: 0 0 18px 0; font-size: 16px; text-align: left;">If you need help or have any questions, please contact the HR or IT support team.</p>
    
    <div style="margin-top: 30px; text-align: left;">
        <p style="margin: 0 0 5px 0; font-size: 16px;">Best regards,</p>
        <p style="margin: 0; font-size: 16px; font-weight: 700;">FWD Technologies</p>
    </div>
</div>  
        `,
    });

    await this.date.LocaleSetDateHelper(to, token);
  }
}

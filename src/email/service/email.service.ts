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
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to FWD Portal</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f5f7fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f7fa; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="100%" max-width="560px" cellpadding="0" cellspacing="0" border="0" style="max-width: 560px; width: 100%; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); overflow: hidden;">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 40px 32px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">FWD Portal</h1>
                    <p style="margin: 8px 0 0 0; color: #a0aec0; font-size: 14px;">FWD Technologies</p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 48px 32px 40px 32px;">
                    <h2 style="margin: 0 0 12px 0; color: #1a202c; font-size: 24px; font-weight: 600;">Welcome to the FWD Portal!</h2>
                    <p style="margin: 0 0 24px 0; color: #4a5568; font-size: 16px; line-height: 1.5;">You have been invited to activate your account.</p>
                    
                    <p style="margin: 0 0 16px 0; color: #4a5568; font-size: 16px; line-height: 1.5;">To get started, please click the button below to <strong>set your password and activate your account.</strong></p>
                    
                    <!-- Button -->
                    <div style="margin: 32px 0; text-align: center;">
                      <a href="${verificationLink}" 
                         style="display: inline-block; background: linear-gradient(135deg, #f5b042 0%, #ffd700 100%); color: #1a202c; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); transition: all 0.3s ease;">
                        Activate Account →
                      </a>
                    </div>
                    
                    <p style="margin: 0 0 20px 0; color: #4a5568; font-size: 16px; line-height: 1.5;">Once completed, you will be able to log in and access the portal.</p>
                    
                    <p style="margin: 0 0 20px 0; color: #4a5568; font-size: 16px; line-height: 1.5;">If you need help or have any questions, please contact the HR or IT support team.</p>
                  </td>
                </tr>
                
                <!-- Divider -->
                <tr>
                  <td style="padding: 0 32px;">
                    <hr style="border: none; height: 1px; background-color: #e2e8f0; margin: 0;">
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 32px; background-color: #fafbfc;">
                    <p style="margin: 0 0 8px 0; color: #718096; font-size: 14px; line-height: 1.5;">Best regards,</p>
                    <p style="margin: 0; color: #1a202c; font-size: 16px; font-weight: 600;">FWD Technologies</p>
                    <p style="margin: 16px 0 0 0; color: #a0aec0; font-size: 12px;">© ${new Date().getFullYear()} FWD Technologies. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    });

    await this.date.LocaleSetDateHelper(to, token);
  }
}

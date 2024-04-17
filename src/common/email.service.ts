import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });
  }

  async sendOtpEmail(email: string, otp: string): Promise<{ message: string }> {
    const mailOptions = {
      from: this.configService.get<string>('EMAIL_FROM'), // Sender address
      to: email, // List of receivers
      subject: `2FA CODE : ${otp}`, // Subject line
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 20px;
                }
                .email-container {
                    background-color: #ffffff;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    text-align: center;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0,0,0,0.1);
                }
                .otp-code {
                    font-size: 24px;
                    margin: 20px 0;
                    color: #333;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <h1>Your OTP</h1>
                <p class="otp-code">${otp}</p>
                <p>Please use the above One-Time Password to complete your sign-in.</p>
            </div>
        </body>
        </html>
      `, // HTML body content
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return { message: 'Success: OTP email was sent' };
    } catch (error) {
      console.error('EmailService Error:', error);
      throw new HttpException(
        'Could not send OTP email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

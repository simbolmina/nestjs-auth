import { Injectable } from '@nestjs/common';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { readFileSync } from 'fs';
import { join } from 'path';
import { AWS_BUCKET_REGION, AWS_NOREPLY_EMAIL } from 'src/common/constants';

@Injectable()
export class EmailService {
  private sesClient: SESClient;

  constructor() {
    this.sesClient = new SESClient({
      region: AWS_BUCKET_REGION,
    });
  }

  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    const params = {
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Body: {
          Html: {
            // Changed from Text to Html
            Data: body,
            Charset: 'UTF-8',
          },
        },
        Subject: {
          Data: subject,
          Charset: 'UTF-8',
        },
      },
      Source: AWS_NOREPLY_EMAIL,
    };

    const command = new SendEmailCommand(params);

    try {
      await this.sesClient.send(command);
    } catch (error) {
      console.error('Email sending error:', error);
    }
  }

  async sendWelcomeEmail(email: string, fullName: string): Promise<void> {
    const htmlTemplatePath = join(
      process.cwd(),
      'templates',
      'welcome-email.html',
    );
    let htmlTemplate = readFileSync(htmlTemplatePath, 'utf8');
    htmlTemplate = htmlTemplate.replace('{{fullName}}', fullName);

    await this.sendEmail(email, "Tevkil'e Hoşgeldiniz", htmlTemplate);
  }

  async sendVerifyEmail(
    email: string,
    verificationToken: string,
  ): Promise<void> {
    const htmlTemplatePath = join(
      process.cwd(),
      'templates',
      'verify-email.html',
    );
    let htmlTemplateForOtp = readFileSync(htmlTemplatePath, 'utf8');
    htmlTemplateForOtp = htmlTemplateForOtp.replace(
      '{{VERIFICATION_TOKEN}}',
      verificationToken,
    );

    await this.sendEmail(
      email,
      'E-Posta Hesabınızı Doğrulayınız',
      htmlTemplateForOtp,
    );
  }

  async sendOtpEmail(email: string, otp: string, subject: string) {
    const htmlTemplatePath = join(process.cwd(), 'templates', 'send-otp.html');
    let htmlTemplate = readFileSync(htmlTemplatePath, 'utf8');
    htmlTemplate = htmlTemplate.replace('{{OTP}}', otp);
    await this.sendEmail(email, subject, htmlTemplate);
  }

  async sendInitialSupportEmail(supportId: string, email: string) {
    const confirmationEmailTemplate = readFileSync(
      join(process.cwd(), 'templates', 'support-ticket-confirmation.html'),
      'utf8',
    );
    const populatedTemplate = confirmationEmailTemplate.replace(
      '{{ticketId}}',
      supportId.toString(),
    );

    await this.sendEmail(email, 'Destek Talebiniz Alındı', populatedTemplate);
  }

  async sendReportEmail(reportId: string, email: string) {
    const confirmationEmailTemplate = readFileSync(
      join(process.cwd(), 'templates', 'support-ticket-confirmation.html'),
      'utf8',
    );
    const populatedTemplate = confirmationEmailTemplate.replace(
      '{{reportId}}',
      reportId.toString(),
    );

    await this.sendEmail(email, 'Şikayet Talebiniz Alındı', populatedTemplate);
  }

  async sendSupportEmail(supportId: string, content: string, email: string) {
    const messageNotificationEmailTemplate = readFileSync(
      join(process.cwd(), 'templates', 'support-ticket-new-message.html'),
      'utf8',
    );
    const populatedTemplate = messageNotificationEmailTemplate
      .replace('{{ticketId}}', supportId)
      .replace('{{messageContent}}', content);

    await this.sendEmail(
      email,
      'Destek Talebiniz Hakkında Yeni Mesajınız Var!',
      populatedTemplate,
    );
  }

  async sendSupportStatusUpdateEmail(
    supportId: string,
    status: string,
    email: string,
  ) {
    const statusUpdateEmailTemplate = readFileSync(
      join(process.cwd(), 'templates', 'support-ticket-status-update.html'),
      'utf8',
    );
    const populatedTemplate = statusUpdateEmailTemplate
      .replace('{{ticketId}}', supportId)
      .replace('{{newStatus}}', status);

    console.log('sending email');

    await this.sendEmail(
      email,
      'Destek Talebinizle İlgili Güncelleme Var',
      populatedTemplate,
    );
  }

  async sendProfilePendingEmail(fullName: string, email: string) {
    const confirmationEmailTemplate = readFileSync(
      join(process.cwd(), 'templates', 'profile-pending.html'),
      'utf8',
    );
    const populatedTemplate = confirmationEmailTemplate.replace(
      '{{fullName}}',
      fullName,
    );

    await this.sendEmail(
      email,
      'Hesabınızın Durumu Hakkında Güncelleme',
      populatedTemplate,
    );
  }

  async sendForgotPasswordEmail(resetToken: string, email: string) {
    const resetLink = `https://www.tevkil-front.falciapp.net/reset-password?token=${resetToken}`;

    const htmlTemplate = readFileSync(
      join(process.cwd(), 'templates', 'reset-password.html'),
      'utf8',
    );

    // Replace placeholders
    const populatedTemplate = htmlTemplate.replace('{{resetLink}}', resetLink);

    await this.sendEmail(email, 'Tevkil - Şifre Sıfırlama', populatedTemplate);
  }
  async sendForgotPasswordEmailForAdminSupport(
    resetToken: string,
    email: string,
  ) {
    const resetLink = `https://www.tevkil-panel.falciapp.net/auth/reset-password?token=${resetToken}`;

    const htmlTemplate = readFileSync(
      join(process.cwd(), 'templates', 'reset-password.html'),
      'utf8',
    );

    // Replace placeholders
    const populatedTemplate = htmlTemplate.replace('{{resetLink}}', resetLink);

    await this.sendEmail(email, 'Tevkil - Şifre Sıfırlama', populatedTemplate);
  }
}

import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { EmailService } from './email.service';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, EmailService],
  exports: [EmailService],
})
export class NotificationsModule {}

import { Injectable } from '@nestjs/common';

@Injectable()
export class SmsService {
  async sendSMS(phoneNumber: string, message: string): Promise<void> {
    // some logic to send sms to phoneNumber
  }
}

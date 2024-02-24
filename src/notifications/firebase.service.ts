import admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import { Notification } from './entities/notification.entity';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class FirebaseService {
  constructor() {
    this.loadFirebaseCredentials();
  }

  private async loadFirebaseCredentials() {
    try {
      const filePath = join(
        __dirname,
        '../../tevkil-25277-firebase-adminsdk-z92f7-0521ca2591.json',
      );
      const serviceAccount = await readFile(filePath, 'utf8');
      admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(serviceAccount)),
      });
    } catch (error) {
      console.error('Error loading Firebase credentials:', error);
    }
  }

  async sendPushNotification(user: User, notification: Notification) {
    const message = {
      notification: {
        title: notification.title,
        body: notification.message,
      },
      token: user.fcmToken,
    };

    try {
      await admin.messaging().send(message);
      console.log('Push notification sent successfully');
    } catch (error) {
      console.error('Error sending push notification:', error);
    }
  }
}

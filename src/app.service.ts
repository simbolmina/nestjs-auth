import { Injectable } from '@nestjs/common';
import { AppInfoDto } from './dtos/app-info.dto';

@Injectable()
export class AppService {
  private readonly appInfo: AppInfoDto = {
    name: 'eCommerce APIs',
    version: '0.3.0',
    description: 'This is ecommerce API built with NestJS',
    web: {
      version: '0.4.0',
      lastUpdate: '2023-05-15',
    },
    mobile: {
      ios: {
        version: '0.2.0',
        lastUpdate: '2023-05-15',
      },
      android: {
        version: '0.2.0',
        lastUpdate: '2023-05-15',
      },
    },
  };

  getAppInfo() {
    return this.appInfo;
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { AppInfoDto } from './common/dto/app-info.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AppService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  private readonly appInfo: AppInfoDto = {
    name: 'eCommerce APIs',
    version: '0.3.0',
    description: 'This is ecommerce API built with NestJS',
    web: {
      version: '0.4.0',
      lastUpdate: '2024-03-19',
    },
    mobile: {
      ios: {
        version: '0.2.0',
        lastUpdate: '2024-03-19',
      },
      android: {
        version: '0.2.0',
        lastUpdate: '2024-03-19',
      },
    },
  };

  getAppInfo() {
    return this.appInfo;
  }

  async getHello() {
    await this.cacheManager.set('cached_item', { key: 32 });
    const cachedItem = await this.cacheManager.get('cached_item');
    console.log(cachedItem);
    return 'Hello World!';
  }
}

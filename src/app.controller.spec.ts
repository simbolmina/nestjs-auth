import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  HealthCheckService,
  TypeOrmHealthIndicator,
  HttpHealthIndicator,
} from '@nestjs/terminus';
import { AppInfoDto } from './common/dtos/app-info.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;
  let healthCheckService: HealthCheckService;
  let db: TypeOrmHealthIndicator;
  let http: HttpHealthIndicator;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
        {
          provide: HealthCheckService,
          useValue: {
            check: jest.fn().mockResolvedValue('health check result'),
          },
        },
        {
          provide: TypeOrmHealthIndicator,
          useValue: {
            pingCheck: jest.fn(),
          },
        },
        {
          provide: HttpHealthIndicator,
          useValue: {
            pingCheck: jest.fn(),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
    healthCheckService = app.get<HealthCheckService>(HealthCheckService);
    db = app.get<TypeOrmHealthIndicator>(TypeOrmHealthIndicator);
    http = app.get<HttpHealthIndicator>(HttpHealthIndicator);
  });

  describe('getAppInfo', () => {
    it('should return app information', () => {
      const result: AppInfoDto = {
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
      jest.spyOn(appService, 'getAppInfo').mockImplementation(() => result);

      expect(appController.getAppInfo()).toBe(result);
    });
  });

  describe('check', () => {
    it('should return health check result', () => {
      const result = 'health check result';
      expect(appController.check()).resolves.toBe(result);
    });
  });
});

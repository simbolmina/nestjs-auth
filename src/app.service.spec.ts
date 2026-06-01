import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return app info', () => {
    const expectedAppInfo = {
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

    expect(service.getAppInfo()).toEqual(expectedAppInfo);
  });
});

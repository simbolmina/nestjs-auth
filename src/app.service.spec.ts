import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return app info', () => {
    const expectedAppInfo = {
      name: 'Pazareo APIs',
      version: '0.3.0',
      description: 'This is pazareo API built with NestJS',
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

    expect(service.getAppInfo()).toEqual(expectedAppInfo);
  });
});

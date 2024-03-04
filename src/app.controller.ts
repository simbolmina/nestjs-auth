import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { HealthCheckDto } from './dtos/healt-check.dto';
import { AppInfoDto } from './dtos/app-info.dto';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private http: HttpHealthIndicator,
  ) {}

  @Get('info')
  @ApiOperation({ summary: 'Get app information' })
  @ApiOkResponse({
    description: 'Returns general information about the application',
    type: AppInfoDto,
  })
  getAppInfo(): AppInfoDto {
    return this.appService.getAppInfo();
  }

  @Get('health')
  @HealthCheck()
  @ApiOperation({ summary: 'Check health status' })
  @ApiOkResponse({
    description: 'Returns the health status of the application',
    type: HealthCheckDto,
  })
  check() {
    return this.health.check([
      async () => this.db.pingCheck('database', { timeout: 300 }),
      async () =>
        this.http.pingCheck('api-docs', 'http://localhost:5000/api-doc'),
    ]);
  }
}

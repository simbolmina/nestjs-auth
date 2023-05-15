import { ApiProperty } from '@nestjs/swagger';

class HealthIndicatorDto {
  @ApiProperty({ description: 'The status of the health indicator' })
  status: string;
}

class HealthIndicatorsDto {
  @ApiProperty({ description: 'Health check for database' })
  database: HealthIndicatorDto;

  @ApiProperty({ description: 'Health check for NestJS documentation' })
  nestjsDocs: HealthIndicatorDto;
}

export class HealthCheckDto {
  @ApiProperty({ description: 'The status of the health check' })
  status: string;

  @ApiProperty({
    description: 'The details of the health check',
    type: HealthIndicatorsDto,
  })
  info: HealthIndicatorsDto;

  @ApiProperty({ description: 'The error details (if any)' })
  error: {};

  @ApiProperty({
    description: 'The details of the health check',
    type: HealthIndicatorsDto,
  })
  details: HealthIndicatorsDto;
}

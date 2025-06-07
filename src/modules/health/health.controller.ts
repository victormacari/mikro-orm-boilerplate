import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  HealthCheckResult,
  HealthCheckService,
  MikroOrmHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  public constructor(
    private readonly configService: ConfigService,
    private readonly health: HealthCheckService,
    private readonly db: MikroOrmHealthIndicator,
  ) {}

  @Get('status')
  public async status(): Promise<HealthCheckResult> {
    return this.health.check([
      () =>
        this.db.pingCheck('database', {
          timeout:
            parseInt(this.configService.get('DB_HEALTH_TIMEOUT'), 10) ?? 5000,
        }),
    ]);
  }
}

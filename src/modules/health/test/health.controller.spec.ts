import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from '../health.controller';
import {
  HealthCheckResult,
  HealthCheckService,
  MikroOrmHealthIndicator,
  TerminusModule,
} from '@nestjs/terminus';
import { ServiceUnavailableException } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createMock } from '@golevelup/ts-jest';
import { faker } from '@faker-js/faker';

describe('HealthController', () => {
  let module: TestingModule;
  let controller: HealthController;
  let healthCheckService: HealthCheckService;
  let db: MikroOrmHealthIndicator;

  const healthyStatus: HealthCheckResult = {
    status: 'ok',
    info: {
      database: {
        status: 'up',
      },
    },
    error: {},
    details: {
      database: {
        status: 'up',
      },
    },
  };

  const faultyStatus: HealthCheckResult = {
    status: 'error',
    info: {
      database: {
        status: 'down',
      },
    },
    error: {},
    details: {
      database: {
        status: 'down',
      },
    },
  };

  const error = new ServiceUnavailableException(faultyStatus);

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [ConfigModule, TerminusModule],
      controllers: [HealthController],
      providers: [
        {
          provide: MikroOrmHealthIndicator,
          useValue: createMock<MikroOrmHealthIndicator>(),
        },
        {
          provide: ConfigService,
          useValue: createMock<ConfigService>({
            get: jest.fn().mockImplementation(() => faker.internet.url()),
          }),
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    healthCheckService = module.get<HealthCheckService>(HealthCheckService);
    db = await module.resolve<MikroOrmHealthIndicator>(MikroOrmHealthIndicator);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await module.close();
  });

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('status', () => {
    it('should check if status method is defined', () => {
      expect(controller.status).toBeDefined();
    });

    it('returns the healthy status', async () => {
      jest
        .spyOn(db, 'pingCheck')
        .mockResolvedValue({ database: { status: 'up' } });

      jest
        .spyOn(healthCheckService, 'check')
        .mockResolvedValueOnce(healthyStatus);

      await expect(controller.status()).resolves.toEqual(healthyStatus);
    });

    it('returns the faulty status', async () => {
      jest
        .spyOn(db, 'pingCheck')
        .mockResolvedValue({ database: { status: 'down' } });

      jest.spyOn(healthCheckService, 'check').mockImplementationOnce(() => {
        throw error;
      });

      await expect(controller.status()).rejects.toThrow(error);
    });
  });
});

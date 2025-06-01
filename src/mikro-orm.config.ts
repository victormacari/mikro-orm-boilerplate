import { EntityGenerator } from '@mikro-orm/entity-generator';
import { Migrator } from '@mikro-orm/migrations';
import { defineConfig, UnderscoreNamingStrategy } from '@mikro-orm/postgresql';
import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import path from 'path';
import migrationConfig from './mikro-orm-migration.config';
import { MigrationGenerator } from './modules/orm/migrator';

dotenv.config({ path: path.resolve('.env') });

const logger = new Logger('MikroORM');

const config = defineConfig({
  extensions: [Migrator, EntityGenerator],
  pool: {
    min: parseInt(process.env.DB_CLIENTS_POOL_MIN, 10) || 10,
    max: parseInt(process.env.DB_CLIENTS_POOL_MAX, 10) || 10,
  },
  discovery: {
    warnWhenNoEntities: true,
    checkDuplicateFieldNames: false,
  },
  allowGlobalContext: false,
  dbName: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '5433', 10),
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  entities: [`${__dirname}/**/*.entity.ts`],
  namingStrategy: UnderscoreNamingStrategy,
  logger: logger.log.bind(logger),
  migrations: {
    pathTs: `${process.cwd()}/migrations`,
    glob: '!(*.d).{js,ts}',
    dropTables: migrationConfig.migrations.dropTables,
    snapshot: true,
    safe: migrationConfig.migrations.safe,
    disableForeignKeys: migrationConfig.migrations.disableForeignKeys,
    generator: MigrationGenerator,
    transactional: migrationConfig.migrations.transactional,
  },
});

export default config;

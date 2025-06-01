import { defineConfig, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';

const config = defineConfig({
  extensions: [Migrator],
  driver: PostgreSqlDriver,
  discovery: {
    warnWhenNoEntities: false,
  },
  forceUtcTimezone: true,
  migrations: {
    path: './dist/migrations',
    transactional: true,
    dropTables: false,
    safe: true,
    disableForeignKeys: false,
  },
});

export default config;

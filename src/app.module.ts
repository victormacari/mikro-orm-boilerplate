import { Module } from '@nestjs/common';
import { OrmModule } from './modules/orm/orm.module';
import { BookModule } from './modules/books/book.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [OrmModule, HealthModule, BookModule],
})
export class AppModule {}

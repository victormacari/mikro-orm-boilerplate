import { Module } from '@nestjs/common';
import { OrmModule } from './modules/orm/orm.module';
import { BookModule } from './modules/books/book.module';

@Module({
  imports: [OrmModule, BookModule],
})
export class AppModule {}

import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Book } from './book.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Book])],
  controllers: [],
  providers: [],
})
export class BookModule {}

import { Collection, Entity, OneToMany, Property } from '@mikro-orm/core';
import { Book } from 'src/modules/books/book.entity';
import { BaseEntity } from 'src/common/base.entity';

@Entity({ tableName: 'authors' })
export class Author extends BaseEntity {
  @Property({ type: 'string' })
  firstName!: string;

  @Property({ type: 'string' })
  lastName!: string;

  @Property({ type: 'text', nullable: true })
  description?: string;

  @Property({ type: 'date', nullable: true })
  birthday?: Date;

  @OneToMany(() => Book, (book) => book.author)
  books = new Collection<Book>(this);
}

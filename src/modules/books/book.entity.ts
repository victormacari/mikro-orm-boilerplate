import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { Author } from 'src/modules/authors/author.entity';
import { BaseEntity } from 'src/common/base.entity';

@Entity({ tableName: 'books' })
export class Book extends BaseEntity {
  @Property({ type: 'string' })
  title!: string;

  @Property({ type: 'text', nullable: true })
  description?: string;

  @Property({ type: 'datetime' })
  publishedAt: Date = new Date();

  @Property({ type: 'boolean', default: true })
  isAvailable: boolean = true;

  @ManyToOne(() => Author, { deleteRule: 'cascade', joinColumn: 'author_id' })
  author!: Author;

  @Property({ type: 'uuid', fieldName: 'author_id' })
  authorId!: string;
}

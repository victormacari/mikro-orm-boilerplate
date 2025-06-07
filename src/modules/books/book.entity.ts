import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Book {
  @PrimaryKey()
  id!: number;

  @Property()
  title!: string;

  @Property({ type: 'text', nullable: true })
  description?: string;

  @Property()
  publishedAt: Date = new Date();

  @Property({ default: true })
  isAvailable: boolean = true;
}

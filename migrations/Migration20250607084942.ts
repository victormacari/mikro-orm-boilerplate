// this file was auto-generated using migration generator

import { Migration } from '@mikro-orm/migrations';

export class Migration20250607084942 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "book" ("id" serial primary key, "title" varchar(255) not null, "description" text null, "published_at" timestamptz not null, "is_available" boolean not null default true);`);
  }

}

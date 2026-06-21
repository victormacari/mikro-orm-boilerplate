// this file was auto-generated using migration generator

import { Migration } from '@mikro-orm/migrations';

export class Migration20260621125210 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "authors" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "first_name" varchar(255) not null, "last_name" varchar(255) not null, "description" text null, "birthday" date null, constraint "authors_pkey" primary key ("id"));`);

    this.addSql(`create table if not exists "books" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "title" varchar(255) not null, "description" text null, "published_at" timestamptz not null, "is_available" boolean not null default true, "author_id" uuid not null, constraint "books_pkey" primary key ("id"));`);

  }

}

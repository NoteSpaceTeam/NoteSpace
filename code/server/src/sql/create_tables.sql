begin;

    create extension if not exists "pgcrypto";

    create type resource_type as enum ('D', 'F');

    create table if not exists workspace (
        id char(12) primary key default encode(gen_random_bytes(8), 'base64'),
        name text not null,
        private boolean not null,
        created_at timestamp not null default now(),
        members char(12)[] not null default '{}'::char(12)[] -- array of user ids
    );

    create table if not exists resource (
        id char(12) primary key default encode(gen_random_bytes(8), 'base64'),
        workspace char(12) not null references workspace(id) on delete cascade,
        name text not null,
        type resource_type not null,
        created_at timestamp not null default now(),
        updated_at timestamp not null default now(),
        parent char(12) default null references resource(id) on delete cascade,
        children char(12)[] not null default '{}'::char(12)[] -- array of resource ids
    );

commit;
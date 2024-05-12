begin;

    create extension if not exists "uuid-ossp";
    create extension if not exists "pgcrypto";

    create type resource_type as enum ('D', 'F');

    create table if not exists workspaces (
        id char(12) primary key default encode(gen_random_bytes(8), 'base64'),
        name text not null,
        created_at timestamp not null default now(),
        updated_at timestamp not null default now()
    );

    create table if not exists resources (
        id char(12) primary key default encode(gen_random_bytes(8), 'base64'),
        workspace varchar not null references workspaces(id) on delete cascade,
        name text not null,
        type resource_type not null,
        created_at timestamp not null default now(),
        updated_at timestamp not null default now()
    );

    create table if not exists resources_children (
        parent char(12) not null references resources(id) on delete cascade,
        child char(12) not null references resources(id) on delete cascade,
        primary key (parent, child)
    );

commit;

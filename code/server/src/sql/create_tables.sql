begin;

    create extension if not exists "uuid-ossp";

    create type resource_type as enum ('D', 'F');

    create table if not exists workspace (
        id uuid primary key default uuid_generate_v4(),
        name text not null,
        created_at timestamp not null default now(),
        updated_at timestamp not null default now()
    );

    create table if not exists resource (
        id uuid primary key default uuid_generate_v4(),
        workspace uuid not null references workspace(id) on delete cascade,
        name text not null,
        type resource_type not null,
        children uuid[] not null default '{}',
        created_at timestamp not null default now(),
        updated_at timestamp not null default now()
    );

    create table if not exists resource_child (
        parent uuid not null references resource(id) on delete cascade,
        child uuid not null references resource(id) on delete cascade,
        primary key (parent, child)
    );

commit;

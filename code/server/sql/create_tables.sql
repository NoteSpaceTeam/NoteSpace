begin;

    create extension if not exists "pgcrypto";

    create type resource_type as enum ('D', 'F');

    create table if not exists workspace (
        id char(16) primary key default encode(gen_random_bytes(8), 'hex'),
        name text not null,
        private boolean not null default false,
        created_at timestamp not null default now(),
        members text[] not null default '{}'::text[] -- references "user"(email)
    );

    create table if not exists resource(
        id char(16) primary key default encode(gen_random_bytes(8), 'hex'),
        workspace char(16) not null references workspace(id) on delete cascade,
        name text not null,
        type resource_type not null,
        created_at timestamp not null default now(),
        updated_at timestamp not null default now(),
        parent char(16) default null references resource(id) on delete cascade,
        children char(16)[] not null default '{}'::char(16)[] -- references resource(id)
    );

    create table if not exists "user" (
        id char(28) primary key,
        name text not null,
        email text not null unique,
        created_at timestamp not null default now()
    );

    -- Triggers
    create or replace trigger on_workspace_insert_trigger
        after insert on workspace
        for each row execute function add_root_resource();

    create or replace trigger on_resource_delete_trigger
        after delete on resource
        for each row execute function on_child_removed();

    create or replace trigger on_resource_update_trigger
        after update on resource
        for each row execute function on_child_updated();

commit;
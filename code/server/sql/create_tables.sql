BEGIN;

-- Create extension if it doesn't exist
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create enum type
CREATE TYPE resource_type AS ENUM ('D', 'F');

-- Create workspace table
CREATE TABLE IF NOT EXISTS workspace (
    id CHAR(16) PRIMARY KEY DEFAULT encode(gen_random_bytes(8), 'hex'),
    name TEXT NOT NULL,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP NOT NULL DEFAULT now()
);

-- Create resource table
CREATE TABLE IF NOT EXISTS resource (
    id CHAR(16) PRIMARY KEY DEFAULT encode(gen_random_bytes(8), 'hex'),
    workspace CHAR(16) NOT NULL REFERENCES workspace(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type resource_type NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
    parent CHAR(16) DEFAULT NULL REFERENCES resource(id) ON DELETE CASCADE,
    children CHAR(16)[] NOT NULL DEFAULT '{}'::CHAR(16)[]
);

-- Create user table
CREATE TABLE IF NOT EXISTS "user" (
    id CHAR(28) PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    "createdAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS workspace_member (
    wid CHAR(16) NOT NULL REFERENCES workspace(id) ON DELETE CASCADE,
    uid CHAR(28) NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    PRIMARY KEY (wid, uid)
);


-- Triggers

    -- Resource is deleted -> Remove self from parent's children array
    create or replace function on_child_removed() returns trigger as $$
        begin
            --- Check if parent resource exists
            if old.parent is not null then
                ---- Remove self from parent's children array
                update resource
                set children = array_remove(children, old.id)
                where id = old.parent;
            end if;
            return old;
        end;
    $$ language plpgsql;

    -- Resource is updated -> Update new and old parent's children array
    create or replace function on_child_updated() returns trigger as $$
        begin
            if new.parent = old.parent then
                return new;
            end if;
            --- Append self to children array of new parent
            if new.parent is not null then
                update resource
                set children = array_append(children, new.id)
                where id = new.parent;
            end if;
            --- Remove self from children array of old parent
            if old.parent is not null then
                update resource
                set children = array_remove(children, old.id)
                where id = old.parent;
            end if;
            return new;
        end;
    $$ language plpgsql;

    -- New resource is created -> Update self's parent id and append self to parent's children array
    create or replace function on_new_resource_created() returns trigger as $$
        begin
            --- parent_id is null
            if new.parent is null then
                if new.id != new.workspace then ---- Workspace resource with root as parent
                    update resource
                    set parent = new.workspace
                    where id = new.id;
                    ---- Append self to root resource's children array
                    update resource
                    set children = array_append(children, new.id)
                    where id = new.workspace;
                    return new;
                else return new; ---- Root resource - do nothing
                end if;
                --- parent_id is not null
            else
                ---- check if parent resource exists
                if not exists (select 1 from resource where id = new.parent) then
                    raise exception 'Parent resource does not exist';
                end if;
                --- Append self to children array of parent resource
                update resource
                set children = array_append(children, new.id)
                where id = new.parent;
                return new;
            end if;
        end;
    $$ language plpgsql;

    -- Add root resource to resource table when a workspace is created
    create or replace function add_root_resource() returns trigger as $$
        begin
            insert into resource (id, workspace, name, type)
            values (new.id, new.id, 'root', 'F');
            return new;
        end;
    $$ language plpgsql;

-- Create triggers
CREATE OR REPLACE TRIGGER on_workspace_insert_trigger
    AFTER INSERT ON workspace
    FOR EACH ROW EXECUTE FUNCTION add_root_resource();

CREATE OR REPLACE TRIGGER on_resource_delete_trigger
    AFTER DELETE ON resource
    FOR EACH ROW EXECUTE FUNCTION on_child_removed();

CREATE OR REPLACE TRIGGER on_resource_update_trigger
    AFTER UPDATE ON resource
    FOR EACH ROW EXECUTE FUNCTION on_child_updated();

CREATE OR REPLACE TRIGGER on_resource_insert_trigger
    AFTER INSERT ON resource
    FOR EACH ROW EXECUTE FUNCTION on_new_resource_created();

COMMIT;

begin;
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
commit ;
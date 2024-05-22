begin;

    -- NEW RESOURCE IS CREATED -> UPDATE SELF'S PARENT ID AND APPEND SELF TO PARENT'S CHILDREN ARRAY
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

    create or replace trigger on_new_resource_created_trigger
        after insert on resource
        for each row execute function on_new_resource_created();

------------------------------------------------------------------------------------------------------------------------

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

    create or replace trigger on_child_removed_trigger
        after delete on resource
        for each row execute function on_child_removed();

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

    create or replace trigger update_child_resource_trigger
        after update on resource
        for each row execute function on_child_updated();
commit ;
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
commit;
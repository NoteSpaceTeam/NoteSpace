begin ;

    create or replace function delete_resource_on_child_delete() returns trigger as $$
    begin
        delete from resource where id = old.child;
        return old;
    end;
    $$ language plpgsql;

--     create or replace trigger delete_resource_trigger
--         after delete on resource_child
--         for each row execute function delete_resource_on_child_delete();

    create or replace function create_root_resource_on_workspace_create() returns trigger as $$
    begin
        insert into resource (id, name, type, parent, workspace)
        values (new.id, 'root', 'F', null, new.id);
        return new;
    end;
    $$ language plpgsql;

    create or replace trigger create_root_resource_trigger
        after insert on workspace
        for each row execute function create_root_resource_on_workspace_create();

commit ;
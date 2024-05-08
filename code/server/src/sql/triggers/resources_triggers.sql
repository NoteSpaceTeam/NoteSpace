begin ;

    -- Create the trigger function
    create or replace function delete_resource_on_child_delete() returns trigger as $$
    begin
        delete from resource where id = old.child;
        return old;
    end;
    $$ language plpgsql;

    create trigger delete_resource_trigger
        after delete on resource_child
        for each row execute function delete_resource_on_child_delete();

commit ;
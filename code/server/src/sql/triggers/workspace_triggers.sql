begin;

 -- Add root resource to resource table when a workspace is created
    create or replace function add_root_resource() returns trigger as $$
    begin
        insert into resource (id, workspace, name, type)
        values (new.id, new.id, 'root', 'F');
        return new;
    end;
    $$ language plpgsql;

    create or replace trigger add_root_resource_trigger
        after insert on workspace
        for each row execute function add_root_resource();

commit;
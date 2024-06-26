begin;

 -- Add root resource to resource table when a workspace is created
    create or replace function add_root_resource() returns trigger as $$
    begin
        insert into resource (id, workspace, name, type)
        values (new.id, new.id, 'root', 'F');
        return new;
    end;
    $$ language plpgsql;
commit;
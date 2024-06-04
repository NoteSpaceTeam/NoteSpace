begin;
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

    create or replace trigger on_resource_delete_trigger
        after delete on resource
        for each row execute function on_child_removed();

commit;
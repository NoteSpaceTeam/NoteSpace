begin ;

    -- Delete all rows from the resources table
    delete from resource;

    -- Delete all rows from the workspaces table
    delete from workspace;

commit ;
begin ;
    -- Insert workspaces
    insert into workspace (name) values ('Workspace 1');
    insert into workspace (name) values ('Workspace 2');

    -- Insert some resources
    insert into resource (name, type, workspace)
    values ('Fol 1', 'F', (select id from workspace where name = 'Workspace 1'));

    insert into resource (name, type, workspace)
    values ('Fol 2', 'F', (select id from workspace where name = 'Workspace 2'));

    insert into resource (name, type, workspace)
    values ('Doc 1', 'D', (select id from workspace where name = 'Workspace 1'));

    insert into resource (name, type, workspace)
    values ('Doc 2', 'D', (select id from workspace where name = 'Workspace 2'));

    -- Insert some children
    insert into resource (name, type, workspace, parent)
    values (
        'Fol 1.1',
        'F',
        (select id from workspace where name = 'Workspace 1'),
        (select id from resource where name = 'Fol 1')
    );


    insert into resource (name, type, workspace, parent)
    values (
        'Fol 1.2',
        'F',
        (select id from workspace where name = 'Workspace 1'),
        (select id from resource where name = 'Fol 1')
    );

    insert into resource (name, type, workspace, parent)
    values (
        'Doc 1.1',
        'D',
        (select id from workspace where name = 'Workspace 1'),
        (select id from resource where name = 'Fol 1')
    );

    insert into resource (name, type, workspace, parent)
    values (
        'Doc 1.2',
        'D',
        (select id from workspace where name = 'Workspace 1'),
        (select id from resource where name = 'Fol 1')
    );

commit ;
begin ;

    drop table if exists resources cascade ;

    drop table if exists workspaces cascade ;

    drop table if exists resources_children cascade ;

    drop type if exists resource_type cascade ;

commit ;
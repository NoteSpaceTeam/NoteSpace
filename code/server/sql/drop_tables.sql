begin ;
    drop table if exists "user";
    drop table if exists resource cascade;
    drop table if exists workspace cascade;
    drop type if exists resource_type cascade;

commit ;
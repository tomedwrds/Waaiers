create table
  public."Routes" (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    name character varying null,
    distance float default 0.0,
    date timestamp without time zone null,
    displayed boolean default true,
    constraint routes_pkey primary key (id)
  ) tablespace pg_default;
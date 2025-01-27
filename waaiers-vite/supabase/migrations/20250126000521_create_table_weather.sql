create table
  public."Weather" (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    wind_direction real null,
    wind_speed real null,
    wind_speed_gust real null,
    latitude real null,
    longitude real null,
    route_id uuid null,
    constraint Weather_pkey primary key (id),
    constraint Weather_route_id_fkey foreign key (route_id) references "Routes" (id) on delete cascade
  ) tablespace pg_default;
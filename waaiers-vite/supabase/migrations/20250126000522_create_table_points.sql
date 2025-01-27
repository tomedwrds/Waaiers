create table
  public."Points" (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    elevation integer null,
    latitude real null,
    longitude real null,
    distance_start real null,
    distance_end real null,
    direction real null,
    route_id uuid null,
    weather_id uuid null default gen_random_uuid (),
    constraint Points_pkey primary key (id),
    constraint Points_route_id_fkey foreign key (route_id) references "Routes" (id) on delete cascade,
    constraint Points_weather_id_fkey foreign key (weather_id) references "Weather" (id)
  ) tablespace pg_default;
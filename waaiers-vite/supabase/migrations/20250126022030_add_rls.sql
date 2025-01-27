alter table public."Routes" enable row level security;
alter table public."Weather" enable row level security;
alter table public."Points" enable row level security;

create policy "Default access Points"
on "public"."Points"
as PERMISSIVE
for ALL
to public
using (
  true
);

create policy "Default access Weather"
on "public"."Weather"
as PERMISSIVE
for ALL
to public
using (
  true
);

create policy "Default access Routes"
on "public"."Routes"
as PERMISSIVE
for ALL
to public
using (
  true
);



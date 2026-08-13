-- challenges_with_state was created with `select c.*`, which Postgres expands
-- and freezes at creation time, so columns added later (photo) never appear.
-- Recreate it so new columns flow through.

drop view challenges_with_state;

create view challenges_with_state
with (security_invoker = on) as
select c.*, (c.starts_at <= now() and now() < c.ends_at) as active
from challenges c;

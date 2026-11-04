-- RLS isolation smoke test. Replace both UUIDs with two existing auth.users IDs.
-- Run as a database owner in a transaction. The authenticated role is used for policy checks.
begin;
do $$
begin
 if not exists(select 1 from auth.users where id='00000000-0000-0000-0000-000000000001')
 or not exists(select 1 from auth.users where id='00000000-0000-0000-0000-000000000002') then
   raise exception 'Replace both sample UUIDs with real test-user IDs before running';
 end if;
end $$;
set local role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',true);
select set_config('request.jwt.claims','{"sub":"00000000-0000-0000-0000-000000000001","role":"authenticated"}',true);
do $$
begin
 if exists(select 1 from public.tasks where user_id <> auth.uid()) then raise exception 'User A can read another user task'; end if;
 if exists(select 1 from public.profiles where id <> auth.uid()) then raise exception 'User A can read another profile'; end if;
end $$;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000002',true);
select set_config('request.jwt.claims','{"sub":"00000000-0000-0000-0000-000000000002","role":"authenticated"}',true);
do $$
begin
 if exists(select 1 from public.tasks where user_id <> auth.uid()) then raise exception 'User B can read another user task'; end if;
 if exists(select 1 from public.profiles where id <> auth.uid()) then raise exception 'User B can read another profile'; end if;
end $$;
rollback;

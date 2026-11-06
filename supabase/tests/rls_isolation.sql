begin;
create extension if not exists pgtap with schema extensions;
select plan(5);

-- Independent identities and owned rows are created as the database owner.
insert into auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
values
 ('10000000-0000-4000-8000-000000000001','authenticated','authenticated','taskflow-a@test.local','',now(),'{}','{}',now(),now()),
 ('20000000-0000-4000-8000-000000000002','authenticated','authenticated','taskflow-b@test.local','',now(),'{}','{}',now(),now())
on conflict (id) do nothing;
insert into public.tasks (id,user_id,title) values
 ('a0000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001','A private task'),
 ('b0000000-0000-4000-8000-000000000002','20000000-0000-4000-8000-000000000002','B private task')
on conflict (id) do nothing;

set local role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-4000-8000-000000000001',true);
select set_config('request.jwt.claims','{"sub":"10000000-0000-4000-8000-000000000001","role":"authenticated"}',true);
select is((select count(*)::int from public.tasks),1,'A can read only A tasks');
select is((select count(*)::int from public.tasks where id='b0000000-0000-4000-8000-000000000002'),0,'A cannot read B task');
update public.tasks set title='Compromised' where id='b0000000-0000-4000-8000-000000000002';
select is((select title from public.tasks where id='b0000000-0000-4000-8000-000000000002'),'B private task','A cannot update B task');
delete from public.tasks where id='b0000000-0000-4000-8000-000000000002';
select is((select count(*)::int from public.tasks where id='b0000000-0000-4000-8000-000000000002'),1,'A cannot delete B task');
select throws_ok(
  $$update public.tasks set user_id='20000000-0000-4000-8000-000000000002' where id='a0000000-0000-4000-8000-000000000001'$$,
  '42501', null, 'A cannot transfer ownership of A task'
);
select * from finish();
rollback;

-- Run after at least one auth user exists. Sample tasks belong to the oldest user.
with owner as (select id from auth.users order by created_at limit 1)
insert into public.tasks (user_id,title,description,status,priority,due_date)
select owner.id, s.title, s.description, s.status, s.priority, s.due_date
from owner cross join (values
 ('Plan the next release','Review scope and milestones.','in_progress','high',current_date + 3),
 ('Update project documentation','Capture setup and architecture notes.','todo','medium',current_date + 5),
 ('Review completed work','Check changes before sharing.','done','low',current_date - 1)
) as s(title,description,status,priority,due_date)
where not exists (select 1 from public.tasks t where t.user_id=owner.id and t.title=s.title);

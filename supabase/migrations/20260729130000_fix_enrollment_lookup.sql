-- Return zero rows when an enrollment does not exist. A scalar composite
-- function returns an all-null object, which clients can mistake for a row.

drop function if exists public.get_my_enrollment(text);

create function public.get_my_enrollment(course_id text)
returns setof public.enrollments
language plpgsql
security definer
set search_path = ''
as $$
declare
  learner_id uuid := auth.uid();
begin
  if learner_id is null then raise exception 'Authentication required'; end if;

  return query
  select e.*
  from public.enrollments e
  where e.user_id = learner_id
    and e.course_id = get_my_enrollment.course_id
  limit 1;
end;
$$;

revoke all on function public.get_my_enrollment(text) from public;
grant execute on function public.get_my_enrollment(text) to authenticated;

notify pgrst, 'reload schema';

-- V2 RPCs use p_ parameter names so PostgreSQL never confuses parameters with
-- table columns. Safe to rerun.

begin;

create extension if not exists pgcrypto;

-- Normalize legacy enrollment schemas before installing policies and RPCs.
alter table public.enrollments
  add column if not exists completed_lessons text[];

create or replace function public.lms_jsonb_to_text_array(p_value jsonb)
returns text[]
language sql
immutable
set search_path = ''
as $$
  select case
    when jsonb_typeof(coalesce(p_value, '[]'::jsonb)) = 'array'
      then coalesce(array_agg(item), array[]::text[])
    else array[]::text[]
  end
  from jsonb_array_elements_text(
    case when jsonb_typeof(coalesce(p_value, '[]'::jsonb)) = 'array'
      then coalesce(p_value, '[]'::jsonb) else '[]'::jsonb end
  ) item;
$$;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'enrollments'
      and column_name = 'completed_lessons' and udt_name = 'jsonb'
  ) then
    execute 'alter table public.enrollments alter column completed_lessons drop default';
    execute 'alter table public.enrollments alter column completed_lessons type text[] using public.lms_jsonb_to_text_array(completed_lessons)';
  end if;
end;
$$;

drop function public.lms_jsonb_to_text_array(jsonb);
update public.enrollments set completed_lessons = array[]::text[] where completed_lessons is null;
alter table public.enrollments alter column completed_lessons set default array[]::text[];
alter table public.enrollments alter column completed_lessons set not null;

create unique index if not exists enrollments_user_course_unique_idx
  on public.enrollments (user_id, course_id);

-- Normalize the original LMS wrapper before any course/progress RPC reads it.
update public.courses
set
  thumbnail_url = coalesce(nullif(thumbnail_url, ''), modules ->> '__thumbnail'),
  modules = modules -> 'items',
  updated_at = now()
where jsonb_typeof(modules) = 'object'
  and jsonb_typeof(modules -> 'items') = 'array';

-- Course metadata is public; full content is delivered only by an authenticated
-- RPC that removes quiz answer keys.
alter table public.courses enable row level security;
alter table public.courses force row level security;
revoke all on public.courses from anon, authenticated;
grant select (id, title, description, duration, level, price, category, instructor, thumbnail_url, created_at)
  on public.courses to anon, authenticated;
grant insert, update, delete on public.courses to authenticated;

drop policy if exists "Courses are readable by everyone" on public.courses;
create policy "Courses are readable by everyone" on public.courses for select using (true);
drop policy if exists "Admins can create courses" on public.courses;
create policy "Admins can create courses" on public.courses for insert
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
drop policy if exists "Admins can update courses" on public.courses;
create policy "Admins can update courses" on public.courses for update
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
drop policy if exists "Admins can delete courses" on public.courses;
create policy "Admins can delete courses" on public.courses for delete
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Learners can read their own enrollment and create only a zero-progress row.
-- All progress mutations happen through the security-definer RPCs below.
alter table public.enrollments enable row level security;
alter table public.enrollments force row level security;
revoke all on public.enrollments from anon, authenticated;
grant select, insert on public.enrollments to authenticated;

drop policy if exists "Learners can read their own enrollments" on public.enrollments;
create policy "Learners can read their own enrollments" on public.enrollments for select to authenticated
  using (auth.uid() = user_id or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
drop policy if exists "Learners can create their own enrollments" on public.enrollments;
drop policy if exists "Learners can create empty enrollments" on public.enrollments;
create policy "Learners can create empty enrollments" on public.enrollments for insert to authenticated
  with check (
    auth.uid() = user_id and progress_percentage = 0 and completed = false
    and cardinality(completed_lessons) = 0
  );
drop policy if exists "Learners can update their own enrollments" on public.enrollments;
drop policy if exists "Admins can update enrollments" on public.enrollments;

create or replace function public.modules_without_quiz_answers(source_modules jsonb)
returns jsonb
language sql
immutable
set search_path = ''
as $$
  select coalesce(jsonb_agg(
    jsonb_set(course_module, '{lessons}', coalesce((
      select jsonb_agg(case when lesson ->> 'type' = 'quiz' then
        jsonb_set(lesson, '{quizQuestions}', coalesce((
          select jsonb_agg(question - 'correctAnswers')
          from jsonb_array_elements(coalesce(lesson -> 'quizQuestions', '[]'::jsonb)) question
        ), '[]'::jsonb)) else lesson end)
      from jsonb_array_elements(
        case when jsonb_typeof(course_module -> 'lessons') = 'array'
          then course_module -> 'lessons' else '[]'::jsonb end
      ) lesson
    ), '[]'::jsonb))
  ), '[]'::jsonb)
  from jsonb_array_elements(
    case
      when jsonb_typeof(source_modules) = 'array' then source_modules
      when jsonb_typeof(source_modules) = 'object'
        and jsonb_typeof(source_modules -> 'items') = 'array' then source_modules -> 'items'
      else '[]'::jsonb
    end
  ) course_module;
$$;
revoke all on function public.modules_without_quiz_answers(jsonb) from public;

create or replace function public.get_course_content_v2(p_course_id text)
returns table (
  id text, title text, description text, duration text, level text, price text,
  category text, instructor text, modules jsonb, thumbnail_url text, created_at timestamptz
)
language sql
security definer
set search_path = ''
as $$
  select c.id, c.title, c.description, c.duration, c.level, c.price,
    c.category, c.instructor, public.modules_without_quiz_answers(c.modules),
    c.thumbnail_url, c.created_at
  from public.courses c
  where auth.uid() is not null and c.id = p_course_id;
$$;

create or replace function public.get_admin_courses()
returns setof public.courses
language plpgsql
security definer
set search_path = ''
as $$
begin
  if coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') <> 'admin' then
    raise exception 'Admin access required';
  end if;
  return query select c.* from public.courses c order by c.created_at desc;
end;
$$;

revoke all on function public.get_course_content_v2(text) from public;
revoke all on function public.get_admin_courses() from public;
grant execute on function public.get_course_content_v2(text) to authenticated;
grant execute on function public.get_admin_courses() to authenticated;

create or replace function public.get_my_enrollment_v2(p_course_id text)
returns setof public.enrollments
language sql
security definer
set search_path = ''
as $$
  select e.* from public.enrollments e
  where e.user_id = auth.uid() and e.course_id = p_course_id
  limit 1;
$$;

create or replace function public.ensure_course_enrollment_v2(p_course_id text)
returns public.enrollments
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_learner_id uuid := auth.uid();
  v_course public.courses;
  v_result public.enrollments;
begin
  if v_learner_id is null then raise exception 'Authentication required'; end if;
  select c.* into v_course from public.courses c where c.id = p_course_id;
  if v_course.id is null then raise exception 'Course not found'; end if;

  insert into public.enrollments (user_id, user_email, course_id, course_title, progress_percentage, completed, completed_lessons)
  values (v_learner_id, coalesce(auth.jwt() ->> 'email', ''), v_course.id, v_course.title, 0, false, array[]::text[])
  on conflict (user_id, course_id) do nothing;

  select e.* into v_result from public.enrollments e
  where e.user_id = v_learner_id and e.course_id = p_course_id;
  return v_result;
end;
$$;

create or replace function public.mark_lesson_complete_v2(p_course_id text, p_lesson_id text)
returns public.enrollments
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_learner_id uuid := auth.uid();
  v_target_lesson jsonb;
  v_valid_lesson_ids text[];
  v_next_completed text[];
  v_total_lessons integer;
  v_result public.enrollments;
begin
  if v_learner_id is null then raise exception 'Authentication required'; end if;
  select lesson into v_target_lesson
  from public.courses c, jsonb_array_elements(c.modules) course_module,
    jsonb_array_elements(coalesce(course_module -> 'lessons', '[]'::jsonb)) lesson
  where c.id = p_course_id and lesson ->> 'id' = p_lesson_id limit 1;
  if v_target_lesson is null then raise exception 'Lesson not found'; end if;
  if v_target_lesson ->> 'type' = 'quiz' then raise exception 'Quiz lessons must be graded'; end if;

  select coalesce(array_agg(lesson ->> 'id'), array[]::text[]), count(*)
  into v_valid_lesson_ids, v_total_lessons
  from public.courses c, jsonb_array_elements(c.modules) course_module,
    jsonb_array_elements(coalesce(course_module -> 'lessons', '[]'::jsonb)) lesson
  where c.id = p_course_id;

  select array_agg(distinct completed_id) into v_next_completed
  from (
    select unnest(coalesce(e.completed_lessons, array[]::text[])) completed_id
    from public.enrollments e where e.user_id = v_learner_id and e.course_id = p_course_id
    union all select p_lesson_id
  ) ids where completed_id = any(v_valid_lesson_ids);

  update public.enrollments e set
    completed_lessons = coalesce(v_next_completed, array[]::text[]),
    progress_percentage = case when v_total_lessons = 0 then 0 else cardinality(coalesce(v_next_completed, array[]::text[])) * 100.0 / v_total_lessons end,
    completed = v_total_lessons > 0 and cardinality(coalesce(v_next_completed, array[]::text[])) = v_total_lessons
  where e.user_id = v_learner_id and e.course_id = p_course_id returning e.* into v_result;
  if v_result.id is null then raise exception 'Enrollment not found'; end if;
  return v_result;
end;
$$;

create or replace function public.submit_quiz_v2(p_course_id text, p_lesson_id text, p_answers jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_learner_id uuid := auth.uid(); v_questions jsonb; v_question jsonb; v_supplied jsonb;
  v_correct integer := 0; v_count integer := 0; v_score integer := 0; v_passed boolean := false;
  v_valid_ids text[]; v_completed text[]; v_total integer;
begin
  if v_learner_id is null then raise exception 'Authentication required'; end if;
  select lesson -> 'quizQuestions' into v_questions
  from public.courses c, jsonb_array_elements(c.modules) course_module,
    jsonb_array_elements(coalesce(course_module -> 'lessons', '[]'::jsonb)) lesson
  where c.id = p_course_id and lesson ->> 'id' = p_lesson_id and lesson ->> 'type' = 'quiz' limit 1;
  if v_questions is null then raise exception 'Quiz not found'; end if;
  for v_question in select value from jsonb_array_elements(v_questions) loop
    v_count := v_count + 1; v_supplied := coalesce(p_answers -> (v_question ->> 'id'), '[]'::jsonb);
    if (select coalesce(jsonb_agg(value order by value::text), '[]'::jsonb) from jsonb_array_elements(v_supplied))
      = (select coalesce(jsonb_agg(value order by value::text), '[]'::jsonb) from jsonb_array_elements(coalesce(v_question -> 'correctAnswers', '[]'::jsonb)))
    then v_correct := v_correct + 1; end if;
  end loop;
  if v_count > 0 then v_score := round(v_correct * 100.0 / v_count); end if;
  v_passed := v_count > 0 and v_score >= 70;
  if v_passed then
    select coalesce(array_agg(lesson ->> 'id'), array[]::text[]), count(*) into v_valid_ids, v_total
    from public.courses c, jsonb_array_elements(c.modules) course_module,
      jsonb_array_elements(coalesce(course_module -> 'lessons', '[]'::jsonb)) lesson where c.id = p_course_id;
    select array_agg(distinct completed_id) into v_completed from (
      select unnest(coalesce(e.completed_lessons, array[]::text[])) completed_id
      from public.enrollments e where e.user_id = v_learner_id and e.course_id = p_course_id
      union all select p_lesson_id
    ) ids where completed_id = any(v_valid_ids);
    update public.enrollments e set completed_lessons = coalesce(v_completed, array[]::text[]),
      progress_percentage = cardinality(coalesce(v_completed, array[]::text[])) * 100.0 / v_total,
      completed = v_total > 0 and cardinality(coalesce(v_completed, array[]::text[])) = v_total
    where e.user_id = v_learner_id and e.course_id = p_course_id;
    if not found then raise exception 'Enrollment not found'; end if;
  end if;
  return jsonb_build_object('score', v_score, 'correctCount', v_correct, 'questionCount', v_count, 'passed', v_passed);
end;
$$;

revoke all on function public.get_my_enrollment_v2(text) from public;
revoke all on function public.ensure_course_enrollment_v2(text) from public;
revoke all on function public.mark_lesson_complete_v2(text, text) from public;
revoke all on function public.submit_quiz_v2(text, text, jsonb) from public;
grant execute on function public.get_my_enrollment_v2(text) to authenticated;
grant execute on function public.ensure_course_enrollment_v2(text) to authenticated;
grant execute on function public.mark_lesson_complete_v2(text, text) to authenticated;
grant execute on function public.submit_quiz_v2(text, text, jsonb) to authenticated;
notify pgrst, 'reload schema';

commit;

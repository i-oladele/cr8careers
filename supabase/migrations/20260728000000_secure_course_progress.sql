-- Protect course content, quiz answers, and certificate eligibility.
-- Learners may no longer write completion fields directly. All progress is
-- computed by the database through the narrow RPCs below.

revoke select on public.courses from anon, authenticated;
grant select (id, title, description, duration, level, price, category, instructor, thumbnail_url, created_at)
  on public.courses to anon, authenticated;

revoke update on public.enrollments from authenticated;

drop policy if exists "Learners can create their own enrollments" on public.enrollments;
create policy "Learners can create empty enrollments"
  on public.enrollments
  for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and progress_percentage = 0
    and completed = false
    and cardinality(completed_lessons) = 0
  );

drop policy if exists "Learners can update their own enrollments" on public.enrollments;
create policy "Admins can update enrollments"
  on public.enrollments
  for update
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create or replace function public.modules_without_quiz_answers(source_modules jsonb)
returns jsonb
language sql
immutable
set search_path = ''
as $$
  select coalesce(jsonb_agg(
    jsonb_set(
      course_module,
      '{lessons}',
      coalesce((
        select jsonb_agg(
          case
            when lesson ->> 'type' = 'quiz' then
              jsonb_set(
                lesson,
                '{quizQuestions}',
                coalesce((
                  select jsonb_agg(question - 'correctAnswers')
                  from jsonb_array_elements(coalesce(lesson -> 'quizQuestions', '[]'::jsonb)) question
                ), '[]'::jsonb)
              )
            else lesson
          end
        )
        from jsonb_array_elements(coalesce(course_module -> 'lessons', '[]'::jsonb)) lesson
      ), '[]'::jsonb)
    )
  ), '[]'::jsonb)
  from jsonb_array_elements(coalesce(source_modules, '[]'::jsonb)) course_module;
$$;

revoke all on function public.modules_without_quiz_answers(jsonb) from public;

create or replace function public.get_course_content(course_id text)
returns table (
  id text, title text, description text, duration text, level text, price text,
  category text, instructor text, modules jsonb, thumbnail_url text, created_at timestamptz
)
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  return query
  select c.id, c.title, c.description, c.duration, c.level, c.price,
    c.category, c.instructor, public.modules_without_quiz_answers(c.modules),
    c.thumbnail_url, c.created_at
  from public.courses c
  where c.id = course_id;
end;
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
  return query select * from public.courses order by created_at desc;
end;
$$;

create or replace function public.mark_lesson_complete(course_id text, lesson_id text)
returns public.enrollments
language plpgsql
security definer
set search_path = ''
as $$
declare
  learner_id uuid := auth.uid();
  target_lesson jsonb;
  valid_lesson_ids text[];
  next_completed text[];
  total_lessons integer;
  result public.enrollments;
begin
  if learner_id is null then raise exception 'Authentication required'; end if;

  select lesson into target_lesson
  from public.courses c,
    jsonb_array_elements(c.modules) course_module,
    jsonb_array_elements(coalesce(course_module -> 'lessons', '[]'::jsonb)) lesson
  where c.id = course_id and lesson ->> 'id' = lesson_id
  limit 1;

  if target_lesson is null then raise exception 'Lesson not found'; end if;
  if target_lesson ->> 'type' = 'quiz' then raise exception 'Quiz lessons must be graded'; end if;

  select coalesce(array_agg(lesson ->> 'id'), '{}'::text[]), count(*)
  into valid_lesson_ids, total_lessons
  from public.courses c,
    jsonb_array_elements(c.modules) course_module,
    jsonb_array_elements(coalesce(course_module -> 'lessons', '[]'::jsonb)) lesson
  where c.id = course_id;

  select array_agg(distinct completed_id) into next_completed
  from (
    select unnest(coalesce(e.completed_lessons, '{}'::text[])) completed_id
    from public.enrollments e where e.user_id = learner_id and e.course_id = mark_lesson_complete.course_id
    union all select lesson_id
  ) ids
  where completed_id = any(valid_lesson_ids);

  update public.enrollments e set
    completed_lessons = coalesce(next_completed, '{}'::text[]),
    progress_percentage = case when total_lessons = 0 then 0 else cardinality(coalesce(next_completed, '{}'::text[])) * 100.0 / total_lessons end,
    completed = total_lessons > 0 and cardinality(coalesce(next_completed, '{}'::text[])) = total_lessons
  where e.user_id = learner_id and e.course_id = mark_lesson_complete.course_id
  returning e.* into result;

  if result.id is null then raise exception 'Enrollment not found'; end if;
  return result;
end;
$$;

create or replace function public.submit_quiz(course_id text, lesson_id text, answers jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  learner_id uuid := auth.uid();
  quiz_questions jsonb;
  question jsonb;
  supplied jsonb;
  correct_count integer := 0;
  question_count integer := 0;
  score integer := 0;
  passed boolean := false;
  valid_lesson_ids text[];
  next_completed text[];
  total_lessons integer;
begin
  if learner_id is null then raise exception 'Authentication required'; end if;

  select lesson -> 'quizQuestions' into quiz_questions
  from public.courses c,
    jsonb_array_elements(c.modules) course_module,
    jsonb_array_elements(coalesce(course_module -> 'lessons', '[]'::jsonb)) lesson
  where c.id = course_id and lesson ->> 'id' = lesson_id and lesson ->> 'type' = 'quiz'
  limit 1;

  if quiz_questions is null then raise exception 'Quiz not found'; end if;

  for question in select value from jsonb_array_elements(quiz_questions)
  loop
    question_count := question_count + 1;
    supplied := coalesce(answers -> (question ->> 'id'), '[]'::jsonb);
    if (select coalesce(jsonb_agg(value order by value::text), '[]'::jsonb) from jsonb_array_elements(supplied))
       = (select coalesce(jsonb_agg(value order by value::text), '[]'::jsonb) from jsonb_array_elements(coalesce(question -> 'correctAnswers', '[]'::jsonb))) then
      correct_count := correct_count + 1;
    end if;
  end loop;

  if question_count > 0 then score := round(correct_count * 100.0 / question_count); end if;
  passed := question_count > 0 and score >= 70;

  if passed then
    select coalesce(array_agg(lesson ->> 'id'), '{}'::text[]), count(*)
    into valid_lesson_ids, total_lessons
    from public.courses c,
      jsonb_array_elements(c.modules) course_module,
      jsonb_array_elements(coalesce(course_module -> 'lessons', '[]'::jsonb)) lesson
    where c.id = course_id;

    select array_agg(distinct completed_id) into next_completed
    from (
      select unnest(coalesce(e.completed_lessons, '{}'::text[])) completed_id
      from public.enrollments e where e.user_id = learner_id and e.course_id = submit_quiz.course_id
      union all select lesson_id
    ) ids
    where completed_id = any(valid_lesson_ids);

    update public.enrollments e set
      completed_lessons = coalesce(next_completed, '{}'::text[]),
      progress_percentage = cardinality(coalesce(next_completed, '{}'::text[])) * 100.0 / total_lessons,
      completed = total_lessons > 0 and cardinality(coalesce(next_completed, '{}'::text[])) = total_lessons
    where e.user_id = learner_id and e.course_id = submit_quiz.course_id;

    if not found then raise exception 'Enrollment not found'; end if;
  end if;

  return jsonb_build_object('score', score, 'correctCount', correct_count, 'questionCount', question_count, 'passed', passed);
end;
$$;

revoke all on function public.get_course_content(text) from public;
revoke all on function public.get_admin_courses() from public;
revoke all on function public.mark_lesson_complete(text, text) from public;
revoke all on function public.submit_quiz(text, text, jsonb) from public;
grant execute on function public.get_course_content(text) to authenticated;
grant execute on function public.get_admin_courses() to authenticated;
grant execute on function public.mark_lesson_complete(text, text) to authenticated;
grant execute on function public.submit_quiz(text, text, jsonb) to authenticated;

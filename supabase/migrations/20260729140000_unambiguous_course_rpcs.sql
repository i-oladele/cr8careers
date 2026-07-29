-- V2 RPCs use p_ parameter names so PostgreSQL never confuses parameters with
-- table columns. Safe to rerun.

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

-- Repair learner course loading when get_course_content is absent from the
-- PostgREST schema cache. Safe to run repeatedly.

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
  id text,
  title text,
  description text,
  duration text,
  level text,
  price text,
  category text,
  instructor text,
  modules jsonb,
  thumbnail_url text,
  created_at timestamptz
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
  select
    c.id,
    c.title,
    c.description,
    c.duration,
    c.level,
    c.price,
    c.category,
    c.instructor,
    public.modules_without_quiz_answers(c.modules),
    c.thumbnail_url,
    c.created_at
  from public.courses c
  where c.id = course_id;
end;
$$;

revoke all on function public.get_course_content(text) from public;
grant execute on function public.get_course_content(text) to authenticated;

-- Ask PostgREST to discover the function immediately instead of waiting for
-- its next automatic schema-cache refresh.
notify pgrst, 'reload schema';

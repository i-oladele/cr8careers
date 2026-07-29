-- Support both current module arrays and the legacy { items: [...] } wrapper.
-- Quiz answers remain removed from learner-facing content. Safe to rerun.

-- Permanently normalize legacy rows so progress and quiz RPCs also operate on
-- the same array shape. Preserve thumbnails previously packed in the wrapper.
update public.courses
set
  thumbnail_url = coalesce(nullif(thumbnail_url, ''), modules ->> '__thumbnail'),
  modules = modules -> 'items',
  updated_at = now()
where jsonb_typeof(modules) = 'object'
  and jsonb_typeof(modules -> 'items') = 'array';

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
notify pgrst, 'reload schema';

create extension if not exists pgcrypto;

create table if not exists public.courses (
  id text primary key default gen_random_uuid()::text,
  title text not null default '',
  description text not null default '',
  duration text not null default '',
  level text not null default '',
  price text not null default '',
  category text not null default '',
  instructor text not null default '',
  modules jsonb not null default '[]'::jsonb,
  thumbnail_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.courses
  add column if not exists id text default gen_random_uuid()::text,
  add column if not exists title text not null default '',
  add column if not exists description text not null default '',
  add column if not exists duration text not null default '',
  add column if not exists level text not null default '',
  add column if not exists price text not null default '',
  add column if not exists category text not null default '',
  add column if not exists instructor text not null default '',
  add column if not exists modules jsonb not null default '[]'::jsonb,
  add column if not exists thumbnail_url text,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  user_email text not null default '',
  course_id text not null references public.courses(id) on delete cascade,
  course_title text not null default '',
  enrolled_at timestamptz not null default now(),
  progress_percentage numeric not null default 0 check (progress_percentage >= 0 and progress_percentage <= 100),
  completed boolean not null default false,
  completed_lessons text[] not null default '{}'::text[],
  updated_at timestamptz not null default now()
);

alter table public.enrollments
  add column if not exists id uuid default gen_random_uuid(),
  add column if not exists user_id uuid,
  add column if not exists user_email text not null default '',
  add column if not exists course_id text,
  add column if not exists course_title text not null default '',
  add column if not exists enrolled_at timestamptz not null default now(),
  add column if not exists progress_percentage numeric not null default 0,
  add column if not exists completed boolean not null default false,
  add column if not exists completed_lessons text[] not null default '{}'::text[],
  add column if not exists updated_at timestamptz not null default now();

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null default '',
  email text not null default '',
  phone text,
  company text,
  service text,
  message text not null default '',
  status text not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.contact_submissions
  add column if not exists id uuid default gen_random_uuid(),
  add column if not exists name text not null default '',
  add column if not exists email text not null default '',
  add column if not exists phone text,
  add column if not exists company text,
  add column if not exists service text,
  add column if not exists message text not null default '',
  add column if not exists status text not null default 'new',
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

update public.courses set id = gen_random_uuid()::text where id is null;
update public.enrollments set id = gen_random_uuid() where id is null;
update public.contact_submissions set id = gen_random_uuid() where id is null;

alter table public.courses alter column id set not null;
alter table public.enrollments alter column id set not null;
alter table public.contact_submissions alter column id set not null;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'courses_pkey'
      and conrelid = 'public.courses'::regclass
  ) then
    alter table public.courses add constraint courses_pkey primary key (id);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'enrollments_pkey'
      and conrelid = 'public.enrollments'::regclass
  ) then
    alter table public.enrollments add constraint enrollments_pkey primary key (id);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'contact_submissions_pkey'
      and conrelid = 'public.contact_submissions'::regclass
  ) then
    alter table public.contact_submissions add constraint contact_submissions_pkey primary key (id);
  end if;
end;
$$;

create unique index if not exists enrollments_user_course_unique_idx
  on public.enrollments (user_id, course_id);

create index if not exists courses_created_at_idx
  on public.courses (created_at desc);

create index if not exists enrollments_user_id_idx
  on public.enrollments (user_id);

create index if not exists enrollments_enrolled_at_idx
  on public.enrollments (enrolled_at desc);

create index if not exists contact_submissions_created_at_idx
  on public.contact_submissions (created_at desc);

create index if not exists contact_submissions_status_idx
  on public.contact_submissions (status);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_courses_updated_at on public.courses;
create trigger set_courses_updated_at
  before update on public.courses
  for each row
  execute function public.set_updated_at();

drop trigger if exists set_enrollments_updated_at on public.enrollments;
create trigger set_enrollments_updated_at
  before update on public.enrollments
  for each row
  execute function public.set_updated_at();

drop trigger if exists set_contact_submissions_updated_at on public.contact_submissions;
create trigger set_contact_submissions_updated_at
  before update on public.contact_submissions
  for each row
  execute function public.set_updated_at();

alter table public.courses enable row level security;
alter table public.enrollments enable row level security;
alter table public.contact_submissions enable row level security;
alter table public.courses force row level security;
alter table public.enrollments force row level security;
alter table public.contact_submissions force row level security;

revoke all on public.courses from anon, authenticated;
revoke all on public.enrollments from anon, authenticated;
revoke all on public.contact_submissions from anon, authenticated;

grant select on public.courses to anon, authenticated;
grant insert, update, delete on public.courses to authenticated;
grant select, insert, update on public.enrollments to authenticated;
grant insert on public.contact_submissions to anon, authenticated;
grant select, update on public.contact_submissions to authenticated;

drop policy if exists "Courses are readable by everyone" on public.courses;
create policy "Courses are readable by everyone"
  on public.courses
  for select
  using (true);

drop policy if exists "Admins can create courses" on public.courses;
create policy "Admins can create courses"
  on public.courses
  for insert
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Admins can update courses" on public.courses;
create policy "Admins can update courses"
  on public.courses
  for update
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Admins can delete courses" on public.courses;
create policy "Admins can delete courses"
  on public.courses
  for delete
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Learners can read their own enrollments" on public.enrollments;
create policy "Learners can read their own enrollments"
  on public.enrollments
  for select
  using (
    auth.uid() = user_id
    or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

drop policy if exists "Learners can create their own enrollments" on public.enrollments;
create policy "Learners can create their own enrollments"
  on public.enrollments
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Learners can update their own enrollments" on public.enrollments;
create policy "Learners can update their own enrollments"
  on public.enrollments
  for update
  using (
    auth.uid() = user_id
    or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  )
  with check (
    auth.uid() = user_id
    or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

drop policy if exists "Anyone can submit contact forms" on public.contact_submissions;
create policy "Anyone can submit contact forms"
  on public.contact_submissions
  for insert
  with check (true);

drop policy if exists "Admins can read contact submissions" on public.contact_submissions;
create policy "Admins can read contact submissions"
  on public.contact_submissions
  for select
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Admins can update contact submissions" on public.contact_submissions;
create policy "Admins can update contact submissions"
  on public.contact_submissions
  for update
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

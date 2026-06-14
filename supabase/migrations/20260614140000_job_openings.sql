-- Job openings: persisted so admin posts survive refreshes and appear on the public site.

create table if not exists public.job_openings (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  company text not null default '',
  department text not null default '',
  location text not null default '',
  type text not null default 'Full-time',
  description text not null default '',
  requirements text not null default '',
  salary text not null default '',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists job_openings_created_at_idx on public.job_openings (created_at desc);
create index if not exists job_openings_is_active_idx on public.job_openings (is_active);

-- Reuse the shared updated_at trigger function (defined in the launch readiness migration).
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_job_openings_updated_at on public.job_openings;
create trigger set_job_openings_updated_at
  before update on public.job_openings
  for each row
  execute function public.set_updated_at();

alter table public.job_openings enable row level security;
alter table public.job_openings force row level security;

revoke all on public.job_openings from anon, authenticated;
grant select on public.job_openings to anon, authenticated;
grant insert, update, delete on public.job_openings to authenticated;

-- The public site only ever sees active postings.
drop policy if exists "Active jobs are public" on public.job_openings;
create policy "Active jobs are public"
  on public.job_openings
  for select
  using (is_active = true);

-- Admins can see everything, including inactive postings, in the dashboard.
drop policy if exists "Admins can read all jobs" on public.job_openings;
create policy "Admins can read all jobs"
  on public.job_openings
  for select
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Admins can create jobs" on public.job_openings;
create policy "Admins can create jobs"
  on public.job_openings
  for insert
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Admins can update jobs" on public.job_openings;
create policy "Admins can update jobs"
  on public.job_openings
  for update
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Admins can delete jobs" on public.job_openings;
create policy "Admins can delete jobs"
  on public.job_openings
  for delete
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

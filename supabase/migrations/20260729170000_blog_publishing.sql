-- Blog publishing for the Insight Centre. Draft content is admin-only; only
-- explicitly published posts can be selected by public clients.

begin;

create extension if not exists pgcrypto;

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null,
  excerpt text not null default '',
  content_html text not null default '',
  category text not null default 'HR Trends',
  author_name text not null default 'Cr8Careers',
  featured_image_url text,
  status text not null default 'draft',
  published_at timestamptz,
  read_time_minutes integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint blog_posts_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint blog_posts_status check (status in ('draft', 'published')),
  constraint blog_posts_read_time check (read_time_minutes between 1 and 120)
);

create unique index if not exists blog_posts_slug_unique_idx on public.blog_posts (lower(slug));
create index if not exists blog_posts_publication_idx on public.blog_posts (status, published_at desc);
create index if not exists blog_posts_created_at_idx on public.blog_posts (created_at desc);

drop trigger if exists set_blog_posts_updated_at on public.blog_posts;
create trigger set_blog_posts_updated_at
  before update on public.blog_posts
  for each row execute function public.set_updated_at();

alter table public.blog_posts enable row level security;
alter table public.blog_posts force row level security;

revoke all on public.blog_posts from anon, authenticated;
grant select on public.blog_posts to anon, authenticated;
grant insert, update, delete on public.blog_posts to authenticated;

drop policy if exists "Published blog posts are public" on public.blog_posts;
create policy "Published blog posts are public"
  on public.blog_posts for select
  using (status = 'published' and published_at is not null and published_at <= now());

drop policy if exists "Admins can read all blog posts" on public.blog_posts;
create policy "Admins can read all blog posts"
  on public.blog_posts for select
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Admins can create blog posts" on public.blog_posts;
create policy "Admins can create blog posts"
  on public.blog_posts for insert
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Admins can update blog posts" on public.blog_posts;
create policy "Admins can update blog posts"
  on public.blog_posts for update
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Admins can delete blog posts" on public.blog_posts;
create policy "Admins can delete blog posts"
  on public.blog_posts for delete
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Blog images are intentionally public because they appear on public posts.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'blog-assets',
  'blog-assets',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read blog assets" on storage.objects;
create policy "Public can read blog assets"
  on storage.objects for select
  using (bucket_id = 'blog-assets');

drop policy if exists "Admins can upload blog assets" on storage.objects;
create policy "Admins can upload blog assets"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'blog-assets'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

drop policy if exists "Admins can update blog assets" on storage.objects;
create policy "Admins can update blog assets"
  on storage.objects for update to authenticated
  using (bucket_id = 'blog-assets' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check (bucket_id = 'blog-assets' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Admins can delete blog assets" on storage.objects;
create policy "Admins can delete blog assets"
  on storage.objects for delete to authenticated
  using (bucket_id = 'blog-assets' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

notify pgrst, 'reload schema';

commit;

import { supabase } from './supabase';

const CONFIG_ERROR = 'Supabase is not configured.';
const BLOG_COLUMNS = 'id,title,slug,excerpt,content_html,category,author_name,featured_image_url,status,published_at,read_time_minutes,created_at,updated_at';

export type BlogPostStatus = 'draft' | 'published';

export interface BlogPostRow {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content_html: string;
  category: string;
  author_name: string;
  featured_image_url: string | null;
  status: BlogPostStatus;
  published_at: string | null;
  read_time_minutes: number;
  created_at: string;
  updated_at: string;
}

export type BlogPostInput = Pick<BlogPostRow, 'title' | 'slug' | 'excerpt' | 'content_html' | 'category' | 'author_name' | 'featured_image_url' | 'status' | 'published_at' | 'read_time_minutes'>;

export function createBlogSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}

export function estimateReadTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/&\w+;/g, ' ').trim();
  return Math.max(1, Math.ceil(text.split(/\s+/).filter(Boolean).length / 220));
}

export async function fetchPublishedBlogPosts(): Promise<{ data: BlogPostRow[]; error: string | null }> {
  if (!supabase) return { data: [], error: CONFIG_ERROR };
  const { data, error } = await supabase.from('blog_posts').select(BLOG_COLUMNS).eq('status', 'published').lte('published_at', new Date().toISOString()).order('published_at', { ascending: false });
  return { data: (data ?? []) as BlogPostRow[], error: error?.message ?? null };
}

export async function fetchPublishedBlogPost(slug: string): Promise<{ data: BlogPostRow | null; error: string | null }> {
  if (!supabase) return { data: null, error: CONFIG_ERROR };
  const { data, error } = await supabase.from('blog_posts').select(BLOG_COLUMNS).eq('slug', slug).eq('status', 'published').lte('published_at', new Date().toISOString()).maybeSingle();
  return { data: data as BlogPostRow | null, error: error?.message ?? null };
}

export async function fetchAllBlogPosts(): Promise<{ data: BlogPostRow[]; error: string | null }> {
  if (!supabase) return { data: [], error: CONFIG_ERROR };
  const { data, error } = await supabase.from('blog_posts').select(BLOG_COLUMNS).order('updated_at', { ascending: false });
  return { data: (data ?? []) as BlogPostRow[], error: error?.message ?? null };
}

export async function createBlogPost(post: BlogPostInput): Promise<{ data: BlogPostRow | null; error: string | null }> {
  if (!supabase) return { data: null, error: CONFIG_ERROR };
  const { data, error } = await supabase.from('blog_posts').insert(post).select(BLOG_COLUMNS).single();
  return { data: data as BlogPostRow | null, error: error?.message ?? null };
}

export async function updateBlogPost(id: string, post: BlogPostInput): Promise<{ data: BlogPostRow | null; error: string | null }> {
  if (!supabase) return { data: null, error: CONFIG_ERROR };
  const { data, error } = await supabase.from('blog_posts').update(post).eq('id', id).select(BLOG_COLUMNS).single();
  return { data: data as BlogPostRow | null, error: error?.message ?? null };
}

export async function deleteBlogPost(id: string): Promise<{ error: string | null }> {
  if (!supabase) return { error: CONFIG_ERROR };
  const { error } = await supabase.from('blog_posts').delete().eq('id', id);
  return { error: error?.message ?? null };
}

export async function uploadBlogImage(file: File): Promise<{ url: string | null; error: string | null }> {
  if (!supabase) return { url: null, error: CONFIG_ERROR };
  if (!file.type.startsWith('image/')) return { url: null, error: 'Please select an image file.' };
  if (file.size > 5 * 1024 * 1024) return { url: null, error: 'Image must be 5 MB or smaller.' };
  const extension = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
  const path = `${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from('blog-assets').upload(path, file, { cacheControl: '3600', upsert: false });
  if (error) return { url: null, error: error.message };
  return { url: supabase.storage.from('blog-assets').getPublicUrl(path).data.publicUrl, error: null };
}

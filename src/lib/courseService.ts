import { supabase } from './supabase';
import type { Module } from '../app/data/courseContent';

const SUPABASE_CONFIG_ERROR = 'Supabase is not configured.';
const COURSE_ASSETS_BUCKET = 'course-assets';

// Uploads a course thumbnail (already compressed client-side) to Supabase Storage and
// returns its public URL. Stored as a real object so the DB only holds a small URL string.
export async function uploadCourseThumbnail(
  courseId: string,
  blob: Blob
): Promise<{ url: string | null; error: string | null }> {
  if (!supabase) return { url: null, error: SUPABASE_CONFIG_ERROR };
  const path = `${courseId}/thumbnail/${Date.now()}.jpg`;
  const { error } = await supabase.storage
    .from(COURSE_ASSETS_BUCKET)
    .upload(path, blob, { upsert: true, contentType: 'image/jpeg' });
  if (error) return { url: null, error: error.message };
  const { data } = supabase.storage.from(COURSE_ASSETS_BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, error: null };
}

// Uploads a lesson attachment to Supabase Storage and returns its public URL + storage path.
// The path is namespaced by course/lesson so re-uploads don't collide and files stay traceable.
export async function uploadLessonFile(
  courseId: string,
  lessonId: string,
  file: File
): Promise<{ url: string | null; path: string | null; error: string | null }> {
  if (!supabase) return { url: null, path: null, error: SUPABASE_CONFIG_ERROR };
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `${courseId}/${lessonId}/${Date.now()}-${safeName}`;
  const { error } = await supabase.storage
    .from(COURSE_ASSETS_BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type || undefined });
  if (error) return { url: null, path: null, error: error.message };
  const { data } = supabase.storage.from(COURSE_ASSETS_BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, path, error: null };
}

export interface CourseRow {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  price: string;
  category: string;
  instructor: string;
  modules: Module[];
  thumbnail_url?: string;
  created_at?: string;
}

export type CourseSummaryRow = Omit<CourseRow, 'modules'>;

const COURSE_COLUMNS = 'id,title,description,duration,level,price,category,instructor,modules,thumbnail_url,created_at';
// Summaries never need the (potentially large) modules JSONB, so they don't select it.
const COURSE_SUMMARY_COLUMNS = 'id,title,description,duration,level,price,category,instructor,thumbnail_url,created_at';

// Modules are stored as a plain JSONB array. Legacy rows wrapped them as
// { __thumbnail, items } to smuggle the thumbnail — unwrap those so old courses still load.
function readModules(raw: unknown): Module[] {
  if (Array.isArray(raw)) return raw as Module[];
  if (raw && typeof raw === 'object' && Array.isArray((raw as { items?: unknown }).items)) {
    return (raw as { items: Module[] }).items;
  }
  return [];
}

// Fallback for legacy rows whose thumbnail lived only in the packed modules object.
function legacyThumbnail(raw: unknown): string {
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    const t = (raw as { __thumbnail?: unknown }).__thumbnail;
    if (typeof t === 'string') return t;
  }
  return '';
}

export async function saveCourse(course: Omit<CourseRow, 'created_at'>): Promise<{ error: string | null }> {
  if (!supabase) return { error: SUPABASE_CONFIG_ERROR };
  const { error } = await supabase.from('courses').insert([{
    ...course,
    thumbnail_url: course.thumbnail_url ?? null,
  }]);
  return { error: error?.message ?? null };
}

export async function fetchCourses(): Promise<{ data: CourseRow[]; error: string | null }> {
  if (!supabase) return { data: [], error: SUPABASE_CONFIG_ERROR };
  const { data, error } = await supabase
    .from('courses')
    .select(COURSE_COLUMNS)
    .order('created_at', { ascending: false });
  const rows = (data ?? []).map(row => ({
    ...row,
    modules: readModules(row.modules),
    thumbnail_url: row.thumbnail_url || legacyThumbnail(row.modules) || '',
  }));
  return { data: rows, error: error?.message ?? null };
}

export async function fetchCourseSummaries(): Promise<{ data: CourseSummaryRow[]; error: string | null }> {
  if (!supabase) return { data: [], error: SUPABASE_CONFIG_ERROR };
  const { data, error } = await supabase
    .from('courses')
    .select(COURSE_SUMMARY_COLUMNS)
    .order('created_at', { ascending: false });
  const summaries = (data ?? []).map(row => ({
    ...row,
    thumbnail_url: row.thumbnail_url ?? '',
  }));
  return { data: summaries, error: error?.message ?? null };
}

export async function fetchCourseById(id: string): Promise<{ data: CourseRow | null; error: string | null }> {
  if (!supabase) return { data: null, error: SUPABASE_CONFIG_ERROR };
  const { data, error } = await supabase
    .from('courses')
    .select(COURSE_COLUMNS)
    .eq('id', id)
    .maybeSingle();

  if (!data) return { data: null, error: error?.message ?? null };

  return {
    data: {
      ...data,
      modules: readModules(data.modules),
      thumbnail_url: data.thumbnail_url || legacyThumbnail(data.modules) || '',
    },
    error: error?.message ?? null,
  };
}

export async function updateCourse(course: Omit<CourseRow, 'created_at'>): Promise<{ error: string | null }> {
  if (!supabase) return { error: SUPABASE_CONFIG_ERROR };
  const { error } = await supabase.from('courses').update({
    title: course.title,
    description: course.description,
    duration: course.duration,
    level: course.level,
    price: course.price,
    category: course.category,
    instructor: course.instructor,
    modules: course.modules,
    thumbnail_url: course.thumbnail_url ?? null,
  }).eq('id', course.id);
  return { error: error?.message ?? null };
}

export async function deleteCourse(id: string): Promise<{ error: string | null }> {
  if (!supabase) return { error: SUPABASE_CONFIG_ERROR };
  const { error } = await supabase.from('courses').delete().eq('id', id);
  return { error: error?.message ?? null };
}

export interface EnrollmentRow {
  id?: string;
  user_id: string;
  user_email: string;
  course_id: string;
  course_title: string;
  enrolled_at?: string;
  progress_percentage: number;
  completed: boolean;
  completed_lessons?: string[];
}

export async function saveEnrollment(enrollment: Omit<EnrollmentRow, 'id' | 'enrolled_at'>): Promise<{ error: string | null }> {
  if (!supabase) return { error: null };
  const { error } = await supabase.from('enrollments').upsert(
    [enrollment],
    { onConflict: 'user_id,course_id' }
  );
  return { error: error?.message ?? null };
}

export async function updateEnrollmentProgress(
  userId: string,
  courseId: string,
  progressPercentage: number,
  completed: boolean,
  completedLessons?: string[]
): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Supabase not configured' };
  const update: Record<string, unknown> = { progress_percentage: progressPercentage, completed };
  if (completedLessons !== undefined) update.completed_lessons = completedLessons;
  const { error } = await supabase.from('enrollments')
    .update(update)
    .eq('user_id', userId)
    .eq('course_id', courseId);
  return { error: error?.message ?? null };
}

export async function fetchUserEnrollment(userId: string, courseId: string): Promise<{ data: EnrollmentRow | null; error: string | null }> {
  if (!supabase) return { data: null, error: null };
  const { data, error } = await supabase
    .from('enrollments')
    .select('*')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .maybeSingle();
  return { data: data ?? null, error: error?.message ?? null };
}

export async function fetchUserEnrollments(userId: string): Promise<{ data: EnrollmentRow[]; error: string | null }> {
  if (!supabase) return { data: [], error: null };
  const { data, error } = await supabase
    .from('enrollments')
    .select('*')
    .eq('user_id', userId)
    .order('enrolled_at', { ascending: false });
  return { data: data ?? [], error: error?.message ?? null };
}

export async function fetchEnrollments(): Promise<{ data: EnrollmentRow[]; error: string | null }> {
  if (!supabase) return { data: [], error: null };
  const { data, error } = await supabase
    .from('enrollments')
    .select('*')
    .order('enrolled_at', { ascending: false });
  return { data: data ?? [], error: error?.message ?? null };
}

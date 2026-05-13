import { supabase } from './supabase';

export interface CourseRow {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  price: string;
  category: string;
  instructor: string;
  modules: any;
  thumbnail_url?: string;
  created_at?: string;
}

// Thumbnail is packed inside the modules JSONB column to avoid needing a separate column.
function packModules(modules: any[], thumbnailUrl: string): any {
  return { __thumbnail: thumbnailUrl, items: modules };
}

function unpackModules(raw: any): { modules: any[]; thumbnail_url: string } {
  if (raw && !Array.isArray(raw) && '__thumbnail' in raw) {
    return { modules: raw.items ?? [], thumbnail_url: raw.__thumbnail ?? '' };
  }
  return { modules: Array.isArray(raw) ? raw : [], thumbnail_url: '' };
}

export async function saveCourse(course: Omit<CourseRow, 'created_at'>): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Supabase not configured' };
  const packed = {
    ...course,
    modules: packModules(course.modules, course.thumbnail_url ?? ''),
    thumbnail_url: undefined,
  };
  const { error } = await supabase.from('courses').insert([packed]);
  return { error: error?.message ?? null };
}

export async function fetchCourses(): Promise<{ data: CourseRow[]; error: string | null }> {
  if (!supabase) return { data: [], error: null };
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false });
  const unpacked = (data ?? []).map(row => {
    const { modules, thumbnail_url } = unpackModules(row.modules);
    return { ...row, modules, thumbnail_url: thumbnail_url || row.thumbnail_url || '' };
  });
  return { data: unpacked, error: error?.message ?? null };
}

export async function updateCourse(course: Omit<CourseRow, 'created_at'>): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Supabase not configured' };
  const { error } = await supabase.from('courses').update({
    title: course.title,
    description: course.description,
    duration: course.duration,
    level: course.level,
    price: course.price,
    category: course.category,
    instructor: course.instructor,
    modules: packModules(course.modules, course.thumbnail_url ?? ''),
  }).eq('id', course.id);
  return { error: error?.message ?? null };
}

export async function deleteCourse(id: string): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Supabase not configured' };
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
}

export async function saveEnrollment(enrollment: Omit<EnrollmentRow, 'id' | 'enrolled_at'>): Promise<{ error: string | null }> {
  if (!supabase) return { error: null };
  const { error } = await supabase.from('enrollments').upsert(
    [enrollment],
    { onConflict: 'user_id,course_id' }
  );
  return { error: error?.message ?? null };
}

export async function updateEnrollmentProgress(userId: string, courseId: string, progressPercentage: number, completed: boolean): Promise<void> {
  if (!supabase) return;
  await supabase.from('enrollments')
    .update({ progress_percentage: progressPercentage, completed })
    .eq('user_id', userId)
    .eq('course_id', courseId);
}

export async function fetchEnrollments(): Promise<{ data: EnrollmentRow[]; error: string | null }> {
  if (!supabase) return { data: [], error: null };
  const { data, error } = await supabase
    .from('enrollments')
    .select('*')
    .order('enrolled_at', { ascending: false });
  return { data: data ?? [], error: error?.message ?? null };
}

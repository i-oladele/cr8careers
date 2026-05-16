import { supabase } from './supabase';
import type { Module } from '../app/data/courseContent';

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

// Thumbnail is packed inside the modules JSONB column to avoid needing a separate column.
interface PackedModules {
  __thumbnail?: string;
  items?: Module[];
}

function packModules(modules: Module[], thumbnailUrl: string): PackedModules {
  return { __thumbnail: thumbnailUrl, items: modules };
}

function isPackedModules(raw: unknown): raw is PackedModules {
  return typeof raw === 'object' && raw !== null && !Array.isArray(raw) && '__thumbnail' in raw;
}

function unpackModules(raw: unknown): { modules: Module[]; thumbnail_url: string } {
  if (isPackedModules(raw)) {
    return { modules: raw.items ?? [], thumbnail_url: raw.__thumbnail ?? '' };
  }
  return { modules: Array.isArray(raw) ? raw as Module[] : [], thumbnail_url: '' };
}

export async function saveCourse(course: Omit<CourseRow, 'created_at'>): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Supabase not configured' };
  const packed = {
    ...course,
    modules: packModules(course.modules, course.thumbnail_url ?? ''),
    thumbnail_url: course.thumbnail_url ?? null,
  };
  const { error } = await supabase.from('courses').insert([packed]);
  return { error: error?.message ?? null };
}

export async function fetchCourses(): Promise<{ data: CourseRow[]; error: string | null }> {
  if (!supabase) return { data: [], error: null };
  const { data, error } = await supabase
    .from('courses')
    .select('id,title,description,duration,level,price,category,instructor,modules,thumbnail_url,created_at')
    .order('created_at', { ascending: false });
  const unpacked = (data ?? []).map(row => {
    const { modules, thumbnail_url } = unpackModules(row.modules);
    return { ...row, modules, thumbnail_url: thumbnail_url || row.thumbnail_url || '' };
  });
  return { data: unpacked, error: error?.message ?? null };
}

export async function fetchCourseSummaries(): Promise<{ data: CourseSummaryRow[]; error: string | null }> {
  if (!supabase) return { data: [], error: null };
  const { data, error } = await supabase
    .from('courses')
    .select('id,title,description,duration,level,price,category,instructor,modules,thumbnail_url,created_at')
    .order('created_at', { ascending: false });
  const summaries = (data ?? []).map(row => {
    const { thumbnail_url } = unpackModules(row.modules);
    const { modules: _modules, ...rest } = row;
    return { ...rest, thumbnail_url: thumbnail_url || row.thumbnail_url || '' };
  });
  return { data: summaries, error: error?.message ?? null };
}

export async function fetchCourseById(id: string): Promise<{ data: CourseRow | null; error: string | null }> {
  if (!supabase) return { data: null, error: null };
  const { data, error } = await supabase
    .from('courses')
    .select('id,title,description,duration,level,price,category,instructor,modules,thumbnail_url,created_at')
    .eq('id', id)
    .maybeSingle();

  if (!data) return { data: null, error: error?.message ?? null };

  const { modules, thumbnail_url } = unpackModules(data.modules);
  return {
    data: {
      ...data,
      modules,
      thumbnail_url: thumbnail_url || data.thumbnail_url || '',
    },
    error: error?.message ?? null,
  };
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
    thumbnail_url: course.thumbnail_url ?? null,
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

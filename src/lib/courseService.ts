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
  modules: any[];
  thumbnail_url?: string;
  created_at?: string;
}

export async function saveCourse(course: Omit<CourseRow, 'created_at'>): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Supabase not configured' };
  const { error } = await supabase.from('courses').insert([course]);
  return { error: error?.message ?? null };
}

export async function fetchCourses(): Promise<{ data: CourseRow[]; error: string | null }> {
  if (!supabase) return { data: [], error: null };
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false });
  return { data: data ?? [], error: error?.message ?? null };
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
    modules: course.modules,
    thumbnail_url: course.thumbnail_url,
  }).eq('id', course.id);
  return { error: error?.message ?? null };
}

export async function deleteCourse(id: string): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Supabase not configured' };
  const { error } = await supabase.from('courses').delete().eq('id', id);
  return { error: error?.message ?? null };
}

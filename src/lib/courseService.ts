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
  created_at?: string;
}

export async function saveCourse(course: Omit<CourseRow, 'created_at'>): Promise<{ error: string | null }> {
  const { error } = await supabase.from('courses').insert([course]);
  return { error: error?.message ?? null };
}

export async function fetchCourses(): Promise<{ data: CourseRow[]; error: string | null }> {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false });
  return { data: data ?? [], error: error?.message ?? null };
}

export async function deleteCourse(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('courses').delete().eq('id', id);
  return { error: error?.message ?? null };
}

import { supabase } from './supabase';

const SUPABASE_CONFIG_ERROR = 'Supabase is not configured.';

export interface JobOpeningInput {
  title: string;
  company: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string;
  salary: string;
  is_active: boolean;
}

export interface JobOpeningRow extends JobOpeningInput {
  id: string;
  created_at: string;
  updated_at?: string;
}

const JOB_COLUMNS = 'id,title,company,department,location,type,description,requirements,salary,is_active,created_at,updated_at';

// Admin view: all postings, active or not.
export async function fetchJobOpenings(): Promise<{ data: JobOpeningRow[]; error: string | null }> {
  if (!supabase) return { data: [], error: SUPABASE_CONFIG_ERROR };
  const { data, error } = await supabase
    .from('job_openings')
    .select(JOB_COLUMNS)
    .order('created_at', { ascending: false });
  return { data: data ?? [], error: error?.message ?? null };
}

// Public view: RLS already hides inactive rows, but we filter explicitly for clarity.
export async function fetchActiveJobOpenings(): Promise<{ data: JobOpeningRow[]; error: string | null }> {
  if (!supabase) return { data: [], error: SUPABASE_CONFIG_ERROR };
  const { data, error } = await supabase
    .from('job_openings')
    .select(JOB_COLUMNS)
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  return { data: data ?? [], error: error?.message ?? null };
}

export async function saveJobOpening(job: JobOpeningInput): Promise<{ error: string | null }> {
  if (!supabase) return { error: SUPABASE_CONFIG_ERROR };
  const { error } = await supabase.from('job_openings').insert([job]);
  return { error: error?.message ?? null };
}

export async function updateJobOpening(id: string, job: Partial<JobOpeningInput>): Promise<{ error: string | null }> {
  if (!supabase) return { error: SUPABASE_CONFIG_ERROR };
  const { error } = await supabase.from('job_openings').update(job).eq('id', id);
  return { error: error?.message ?? null };
}

export async function deleteJobOpening(id: string): Promise<{ error: string | null }> {
  if (!supabase) return { error: SUPABASE_CONFIG_ERROR };
  const { error } = await supabase.from('job_openings').delete().eq('id', id);
  return { error: error?.message ?? null };
}

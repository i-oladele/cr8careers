import { supabase } from './supabase';

export interface ContactSubmissionInput {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  message: string;
}

export interface ContactSubmissionRow extends ContactSubmissionInput {
  id: string;
  status: 'new' | 'contacted' | 'closed';
  created_at: string;
  updated_at?: string;
}

export async function submitContactSubmission(
  submission: ContactSubmissionInput
): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Supabase is not configured.' };

  const { error } = await supabase.from('contact_submissions').insert([{
    name: submission.name.trim(),
    email: submission.email.trim().toLowerCase(),
    phone: submission.phone?.trim() || null,
    company: submission.company?.trim() || null,
    service: submission.service?.trim() || null,
    message: submission.message.trim(),
  }]);

  return { error: error?.message ?? null };
}

export async function fetchContactSubmissions(): Promise<{ data: ContactSubmissionRow[]; error: string | null }> {
  if (!supabase) return { data: [], error: 'Supabase is not configured.' };

  const { data, error } = await supabase
    .from('contact_submissions')
    .select('id,name,email,phone,company,service,message,status,created_at,updated_at')
    .order('created_at', { ascending: false });

  return { data: data ?? [], error: error?.message ?? null };
}

export async function updateContactSubmissionStatus(
  id: string,
  status: ContactSubmissionRow['status']
): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Supabase is not configured.' };

  const { error } = await supabase
    .from('contact_submissions')
    .update({ status })
    .eq('id', id);

  return { error: error?.message ?? null };
}

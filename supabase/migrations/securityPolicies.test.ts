import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const migration = readFileSync(
  resolve(process.cwd(), 'supabase/migrations/20260728000000_secure_course_progress.sql'),
  'utf8',
);
const storageMigration = readFileSync(
  resolve(process.cwd(), 'supabase/migrations/20260728010000_private_course_assets.sql'),
  'utf8',
);

describe('database security migration contracts', () => {
  it('revokes learner writes and prevents pre-completed enrolment inserts', () => {
    expect(migration).toContain('revoke update on public.enrollments from authenticated');
    expect(migration).toContain('and progress_percentage = 0');
    expect(migration).toContain('and completed = false');
    expect(migration).toContain('and cardinality(completed_lessons) = 0');
  });

  it('removes answer keys and grades quizzes in a security-definer RPC', () => {
    expect(migration).toContain("question - 'correctAnswers'");
    expect(migration).toContain('function public.submit_quiz');
    expect(migration).toContain('security definer');
  });

  it('keeps lesson assets private and authorizes enrolled learners', () => {
    expect(storageMigration).toContain("update storage.buckets set public = false where id = 'course-assets'");
    expect(storageMigration).toContain('Enrolled learners can read course assets');
    expect(storageMigration).toContain('e.user_id = auth.uid()');
  });
});

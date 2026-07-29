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
const enrollmentRpcMigration = readFileSync(
  resolve(process.cwd(), 'supabase/migrations/20260729120000_enrollment_access_rpcs.sql'),
  'utf8',
);
const enrollmentLookupFix = readFileSync(
  resolve(process.cwd(), 'supabase/migrations/20260729130000_fix_enrollment_lookup.sql'),
  'utf8',
);
const unambiguousRpcs = readFileSync(
  resolve(process.cwd(), 'supabase/migrations/20260729140000_unambiguous_course_rpcs.sql'),
  'utf8',
);
const completeLmsFix = readFileSync(
  resolve(process.cwd(), 'supabase/migrations/20260729150000_complete_lms_fix.sql'),
  'utf8',
);
const legacyCourseFix = readFileSync(
  resolve(process.cwd(), 'supabase/migrations/20260729160000_support_legacy_course_modules.sql'),
  'utf8',
);

describe('database security migration contracts', () => {
  it('revokes learner writes and prevents pre-completed enrolment inserts', () => {
    expect(migration).toContain('completed_lessons type text[]');
    expect(migration).toContain('revoke update on public.enrollments from authenticated');
    expect(migration).toContain('grant select, insert on public.enrollments to authenticated');
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

  it('routes learner enrollment access through authenticated RPCs', () => {
    expect(enrollmentRpcMigration).toContain('function public.get_my_enrollment');
    expect(enrollmentRpcMigration).toContain('function public.ensure_course_enrollment');
    expect(enrollmentRpcMigration).toContain('grant execute on function public.get_my_enrollment(text) to authenticated');
    expect(enrollmentLookupFix).toContain('returns setof public.enrollments');
    expect(unambiguousRpcs).toContain('get_my_enrollment_v2(p_course_id text)');
    expect(unambiguousRpcs).toContain('mark_lesson_complete_v2(p_course_id text, p_lesson_id text)');
  });

  it('provides one transactional migration for the complete LMS repair', () => {
    expect(completeLmsFix).toContain('begin;');
    expect(completeLmsFix).toContain('get_course_content_v2(p_course_id text)');
    expect(completeLmsFix).toContain('ensure_course_enrollment_v2(p_course_id text)');
    expect(completeLmsFix).toContain('mark_lesson_complete_v2(p_course_id text, p_lesson_id text)');
    expect(completeLmsFix).toContain("notify pgrst, 'reload schema'");
    expect(completeLmsFix).toContain('commit;');
  });

  it('supports legacy wrapped course modules without exposing answers', () => {
    expect(legacyCourseFix).toContain("source_modules -> 'items'");
    expect(legacyCourseFix).toContain("question - 'correctAnswers'");
  });
});

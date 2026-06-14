import { useState, useEffect } from 'react';
import { fetchEnrollments, EnrollmentRow } from '../../../lib/courseService';

export function LearnersSection() {
  const [enrollments, setEnrollments] = useState<EnrollmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tableError, setTableError] = useState<string | null>(null);

  useEffect(() => {
    fetchEnrollments().then(({ data, error }) => {
      if (error) setTableError(error);
      setEnrollments(data);
      setLoading(false);
    });
  }, []);

  // Group enrollments by learner email
  const learnerMap = enrollments.reduce<Record<string, { email: string; courses: EnrollmentRow[] }>>(
    (acc, row) => {
      if (!acc[row.user_email]) acc[row.user_email] = { email: row.user_email, courses: [] };
      acc[row.user_email].courses.push(row);
      return acc;
    },
    {}
  );

  const filtered = Object.values(learnerMap).filter(l =>
    l.email.toLowerCase().includes(search.toLowerCase()) ||
    l.courses.some(c => c.course_title.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-['DM_Sans',sans-serif] font-bold text-2xl text-[#1d1d1d]">Learners</h2>
        <span className="font-['DM_Sans',sans-serif] text-sm text-gray-500">{Object.keys(learnerMap).length} enrolled</span>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by email or course..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-md border border-gray-300 rounded-lg px-4 py-2 font-['DM_Sans',sans-serif] text-sm focus:outline-none focus:ring-2 focus:ring-[#ed2a10]"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <p className="font-['DM_Sans',sans-serif] text-gray-500">Loading learners...</p>
        </div>
      ) : tableError ? (
        <div className="bg-white rounded-xl shadow p-10">
          <div className="text-4xl mb-3 text-center">!</div>
          <h3 className="font-['DM_Sans',sans-serif] font-bold text-lg text-[#1d1d1d] mb-2 text-center">Enrollments table not set up</h3>
          <p className="font-['DM_Sans',sans-serif] text-gray-500 text-sm mb-4 text-center">
            Apply the Supabase migration in this project to create the required tables, constraints, grants, and RLS policies.
          </p>
          <pre className="bg-gray-900 text-green-400 text-xs rounded-lg p-4 overflow-x-auto font-mono leading-relaxed whitespace-pre">{`supabase db push

Migration:
supabase/migrations/001_add_course_thumbnail_url.sql`}</pre>
          <p className="font-['DM_Sans',sans-serif] text-xs text-gray-400 mt-3 text-center">
            Error: {tableError}
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-12 text-center">
          <div className="text-4xl mb-4">👥</div>
          <h3 className="font-['DM_Sans',sans-serif] font-bold text-lg text-[#1d1d1d] mb-2">No learners yet</h3>
          <p className="font-['DM_Sans',sans-serif] text-gray-500 text-sm">Learners will appear here once they enrol in a course.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(learner => (
            <div key={learner.email} className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#333333] text-white flex items-center justify-center font-['DM_Sans',sans-serif] font-bold text-sm">
                  {learner.email[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-['DM_Sans',sans-serif] font-semibold text-[#1d1d1d]">{learner.email}</p>
                  <p className="font-['DM_Sans',sans-serif] text-xs text-gray-500">{learner.courses.length} course{learner.courses.length !== 1 ? 's' : ''} enrolled</p>
                </div>
              </div>
              <div className="space-y-3">
                {learner.courses.map(course => (
                  <div key={course.course_id} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
                    <div className="flex-1 min-w-0 mr-4">
                      <p className="font-['DM_Sans',sans-serif] font-medium text-sm text-[#1d1d1d] truncate">{course.course_title}</p>
                      <p className="font-['DM_Sans',sans-serif] text-xs text-gray-500 mt-0.5">
                        Enrolled {course.enrolled_at ? new Date(course.enrolled_at).toLocaleDateString() : '—'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="w-28">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-['DM_Sans',sans-serif] text-gray-500">Progress</span>
                          <span className="font-['DM_Sans',sans-serif] font-semibold">{Math.round(course.progress_percentage)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-[#0d9488] h-1.5 rounded-full"
                            style={{ width: `${course.progress_percentage}%` }}
                          />
                        </div>
                      </div>
                      {course.completed ? (
                        <span className="bg-green-100 text-green-700 text-xs font-['DM_Sans',sans-serif] font-semibold px-2 py-1 rounded-full">Completed</span>
                      ) : (
                        <span className="bg-blue-100 text-blue-700 text-xs font-['DM_Sans',sans-serif] font-semibold px-2 py-1 rounded-full">In Progress</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

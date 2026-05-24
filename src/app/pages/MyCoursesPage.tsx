import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SiteHeader from '../components/SiteHeader';
import { fetchUserEnrollments, fetchCourseSummaries } from '../../lib/courseService';
import { useAuth } from '../context/AuthContext';
import type { Course } from '../data/courseContent';

interface EnrolledCourse {
  id: string;
  title: string;
  duration: string;
  level: string;
  instructor: string;
  thumbnail_url: string;
  progressPercentage: number;
  completed: boolean;
  courseData: Course;
}

function CourseCard({ course, userName, userId }: {
  course: EnrolledCourse;
  userName: string;
  userId?: string;
}) {
  const handleCertificateDownload = async () => {
    const { downloadCertificate } = await import('../components/CertificateGenerator');
    await downloadCertificate(course.courseData, userName, userId);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      {course.thumbnail_url && (
        <div className="h-44 overflow-hidden">
          <img
            src={course.thumbnail_url}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-['DM_Sans',sans-serif] font-bold text-base text-[#1d1d1d] leading-snug">
            {course.title}
          </h3>
          {course.completed && (
            <span className="ml-3 shrink-0 bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full text-xs font-['DM_Sans',sans-serif] font-semibold">
              Completed
            </span>
          )}
        </div>

        <p className="font-['DM_Sans',sans-serif] text-sm text-gray-500 mb-4">
          {course.duration} · {course.level}
        </p>

        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="font-['DM_Sans',sans-serif] text-gray-500">Progress</span>
            <span className="font-['DM_Sans',sans-serif] font-semibold text-[#1d1d1d]">
              {Math.round(course.progressPercentage)}%
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div
              className="bg-[#0d9488] h-1.5 rounded-full transition-all"
              style={{ width: `${course.progressPercentage}%` }}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/course/${course.id}`}
            className="flex-1 bg-[#0d9488] text-white py-2 px-4 rounded-lg hover:bg-[#0a7a70] transition-colors font-['DM_Sans',sans-serif] font-semibold text-center text-sm"
          >
            {course.completed ? 'Review' : 'Continue'}
          </Link>
          {course.completed && (
            <button
              onClick={handleCertificateDownload}
              className="flex-1 border border-[#0d9488] text-[#0d9488] py-2 px-4 rounded-lg hover:bg-[#0d9488] hover:text-white transition-colors font-['DM_Sans',sans-serif] font-semibold text-sm"
            >
              Certificate
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-['DM_Sans',sans-serif] font-bold text-xl text-[#1d1d1d] mb-5">
      {children}
    </h2>
  );
}

export default function MyCoursesPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [inProgress, setInProgress] = useState<EnrolledCourse[]>([]);
  const [completed, setCompleted] = useState<EnrolledCourse[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Learner';

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/login?redirect=/my-courses', { replace: true });
      return;
    }

    let cancelled = false;

    const load = async () => {
      setPageLoading(true);
      setPageError(null);

      try {
        const [
          { data: enrollments, error: enrollmentsError },
          { data: courses, error: coursesError },
        ] = await Promise.all([
          fetchUserEnrollments(user.id),
          fetchCourseSummaries(),
        ]);

        if (enrollmentsError || coursesError) {
          throw new Error(enrollmentsError ?? coursesError ?? 'Could not load your courses.');
        }

        if (cancelled) return;

        const mapped: EnrolledCourse[] = enrollments.map(e => {
          const full = courses.find(c => c.id === e.course_id);
          return {
            id: e.course_id,
            title: e.course_title,
            duration: full?.duration ?? '',
            level: full?.level ?? '',
            instructor: full?.instructor ?? 'CR8Careers',
            thumbnail_url: full?.thumbnail_url ?? '',
            progressPercentage: e.progress_percentage,
            completed: e.completed,
            courseData: {
              id: e.course_id,
              title: e.course_title,
              instructor: full?.instructor ?? 'CR8Careers',
              duration: full?.duration ?? 'Self-paced',
              level: full?.level ?? 'All Levels',
              modules: [] as Course['modules'],
              description: full?.description ?? '',
              price: full?.price ?? '',
              category: full?.category ?? '',
            },
          };
        });

        setInProgress(mapped.filter(c => !c.completed));
        setCompleted(mapped.filter(c => c.completed));
      } catch (err) {
        if (!cancelled) {
          setPageError(err instanceof Error ? err.message : 'Could not load your courses.');
        }
      } finally {
        if (!cancelled) setPageLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [authLoading, navigate, user]);

  const hasNoCourses = !pageLoading && !pageError && inProgress.length === 0 && completed.length === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />

      <div className="pt-40 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="font-['DM_Sans',sans-serif] font-bold text-3xl text-[#1d1d1d] mb-1">
                My Courses
              </h1>
              <p className="font-['DM_Sans',sans-serif] text-gray-500">
                {!pageLoading && !pageError
                  ? `${inProgress.length + completed.length} course${inProgress.length + completed.length !== 1 ? 's' : ''} enrolled`
                  : 'Your enrolled courses'}
              </p>
            </div>
            <Link
              to="/courses"
              className="inline-flex items-center gap-1 text-[#0d9488] hover:text-[#0a7a70] font-['DM_Sans',sans-serif] font-semibold text-sm transition-colors"
            >
              Browse Courses →
            </Link>
          </div>

          {pageLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 h-72 animate-pulse" />
              ))}
            </div>
          ) : pageError ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center">
              <p className="font-['DM_Sans',sans-serif] text-gray-600">{pageError}</p>
            </div>
          ) : hasNoCourses ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                📚
              </div>
              <h3 className="font-['DM_Sans',sans-serif] font-bold text-lg text-[#1d1d1d] mb-2">
                No courses yet
              </h3>
              <p className="font-['DM_Sans',sans-serif] text-gray-500 mb-6">
                Enrol in a course to start your learning journey
              </p>
              <Link
                to="/courses"
                className="inline-block bg-[#0d9488] text-white py-2.5 px-6 rounded-lg hover:bg-[#0a7a70] transition-colors font-['DM_Sans',sans-serif] font-semibold"
              >
                Browse Courses
              </Link>
            </div>
          ) : (
            <>
              {inProgress.length > 0 && (
                <section className="mb-12">
                  <SectionHeading>In Progress</SectionHeading>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {inProgress.map(course => (
                      <CourseCard
                        key={course.id}
                        course={course}
                        userName={userName}
                        userId={user?.id}
                      />
                    ))}
                  </div>
                </section>
              )}

              {completed.length > 0 && (
                <section>
                  <SectionHeading>Completed</SectionHeading>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {completed.map(course => (
                      <CourseCard
                        key={course.id}
                        course={course}
                        userName={userName}
                        userId={user?.id}
                      />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

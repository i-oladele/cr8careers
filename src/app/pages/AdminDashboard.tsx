import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Course } from '../data/courseContent';
import { saveCourse, updateCourse, fetchCourses, deleteCourse, CourseRow } from '../../lib/courseService';
import { supabase } from '../../lib/supabase';
import { Sidebar } from './admin/Sidebar';
import { LearnersSection } from './admin/LearnersSection';
import { ContactSubmissionsSection } from './admin/ContactSubmissionsSection';
import { JobOpenings } from './admin/JobsSection';
import { CourseCreationWizard } from './admin/CourseCreationWizard';

// Main Admin Dashboard Component
export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('courses');
  const [showCourseWizard, setShowCourseWizard] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [adminVerified, setAdminVerified] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();

  const showToast = (message: string, type: 'success' | 'error') => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  };

  // Check if user is authenticated admin via Supabase session
  useEffect(() => {
    (async () => {
      if (!supabase) {
        navigate('/admin/login');
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session || session.user.app_metadata?.role !== 'admin') {
        navigate('/admin/login');
        return;
      }
      setAdminVerified(true);
    })();
  }, [navigate]);

  const mapRowToCourse = (row: CourseRow): Course => ({
    id: row.id,
    title: row.title,
    description: row.description,
    duration: row.duration,
    level: row.level,
    price: row.price,
    category: row.category,
    instructor: row.instructor,
    modules: row.modules ?? [],
    thumbnailUrl: row.thumbnail_url ?? '',
  });

  const reloadCourses = async () => {
    const { data, error } = await fetchCourses();
    if (!error) setCourses(data.map(mapRowToCourse));
  };

  // Fetch courses from Supabase on mount
  useEffect(() => {
    if (!adminVerified) return;
    reloadCourses().finally(() => setCoursesLoading(false));
  }, [adminVerified]);

  const handleCourseSave = async (savedCourse: Course): Promise<string | null> => {
    const payload = {
      id: savedCourse.id,
      title: savedCourse.title,
      description: savedCourse.description,
      duration: savedCourse.duration,
      level: savedCourse.level,
      price: savedCourse.price,
      category: savedCourse.category,
      instructor: savedCourse.instructor,
      modules: savedCourse.modules,
      thumbnail_url: savedCourse.thumbnailUrl ?? '',
    };
    try {
      if (editingCourse) {
        const { error } = await updateCourse(payload);
        if (error) { showToast(error, 'error'); return error; }
        showToast('Course updated successfully.', 'success');
      } else {
        const { error } = await saveCourse(payload);
        if (error) { showToast(error, 'error'); return error; }
        showToast('Course created successfully.', 'success');
      }
      await reloadCourses();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Something went wrong. Please try again.';
      showToast(msg, 'error');
      return msg;
    }
    setEditingCourse(null);
    setShowCourseWizard(false);
    return null;
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm('Delete this course? This cannot be undone.')) return;
    const { error } = await deleteCourse(id);
    if (error) { showToast(error, 'error'); return; }
    showToast('Course deleted.', 'success');
    await reloadCourses();
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || course.category === filterCategory;
    const matchesLevel = filterLevel === 'all' || course.level === filterLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-xl shadow-lg font-['DM_Sans',sans-serif] text-sm font-medium transition-all ${
          toast.type === 'success' ? 'bg-[#0d9488] text-white' : 'bg-[#ed2a10] text-white'
        }`}>
          {toast.type === 'success' ? (
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          ) : (
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          )}
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 opacity-75 hover:opacity-100">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}

      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      {/* Main Content */}
      <div className="ml-64">
        {/* Top Header */}
        <header className="fixed top-0 left-0 right-0 bg-white z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-36">
              <div className="flex items-center gap-8">
                <Link to="/" className="h-24 w-48">
                  <img alt="CR8Careers Logo" className="h-full w-full object-contain" src="/logo.png" />
                </Link>
              </div>
              <nav className="hidden md:flex gap-8 items-center">
                <Link to="/" className="font-['DM_Sans',sans-serif] text-[#1d1d1d] text-sm hover:text-[#ed2a10] transition-colors">Home</Link>
                <Link to="/courses" className="font-['DM_Sans',sans-serif] text-[#1d1d1d] text-sm hover:text-[#ed2a10] transition-colors">Courses</Link>
              </nav>
              <div className="flex items-center gap-4">
                <span className="font-['DM_Sans',sans-serif] text-gray-600">
                  Welcome back, Admin
                </span>
                <div className="w-8 h-8 bg-[#ed2a10] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="pt-36">
          {activeSection === 'courses' && !showCourseWizard && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-['DM_Sans',sans-serif] font-bold text-2xl text-gray-900">
                    Courses
                  </h2>
                  <p className="font-['DM_Sans',sans-serif] text-gray-600">
                    Create and manage your course content
                  </p>
                </div>
                <button
                  onClick={() => setShowCourseWizard(true)}
                  className="bg-[#ed2a10] text-white px-6 py-3 rounded-lg hover:bg-[#d42610] transition-colors font-['DM_Sans',sans-serif] font-semibold"
                >
                  Create New Course
                </button>
              </div>

              {/* Search and Filter Section */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Search Bar */}
                  <div className="md:col-span-2">
                    <label className="block font-['DM_Sans',sans-serif] font-medium text-gray-700 mb-2">
                      Search Courses
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by title, description, or instructor..."
                        className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 font-['DM_Sans',sans-serif] focus:ring-2 focus:ring-[#ed2a10] focus:border-transparent"
                      />
                      <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <label className="block font-['DM_Sans',sans-serif] font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 font-['DM_Sans',sans-serif] focus:ring-2 focus:ring-[#ed2a10] focus:border-transparent"
                    >
                      <option value="all">All Categories</option>
                      <option value="Leadership">Leadership</option>
                      <option value="Technical">Technical</option>
                      <option value="Soft Skills">Soft Skills</option>
                      <option value="Career">Career</option>
                      <option value="Core Hospitality">Core Hospitality</option>
                    </select>
                  </div>

                  {/* Level Filter */}
                  <div>
                    <label className="block font-['DM_Sans',sans-serif] font-medium text-gray-700 mb-2">
                      Level
                    </label>
                    <select
                      value={filterLevel}
                      onChange={(e) => setFilterLevel(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 font-['DM_Sans',sans-serif] focus:ring-2 focus:ring-[#ed2a10] focus:border-transparent"
                    >
                      <option value="all">All Levels</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                {/* Clear Filters */}
                {(searchTerm || filterCategory !== 'all' || filterLevel !== 'all') && (
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-['DM_Sans',sans-serif] text-sm text-gray-600">
                      Showing {filteredCourses.length} of {courses.length} courses
                    </span>
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setFilterCategory('all');
                        setFilterLevel('all');
                      }}
                      className="text-[#ed2a10] hover:text-[#d42610] font-['DM_Sans',sans-serif] font-medium text-sm"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>

              {/* Courses Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => {
                  const getCardStyles = () => {
                    switch(course.category) {
                      case 'Leadership':
                        return {
                          bgColor: 'bg-white',
                          borderColor: 'border-gray-200',
                          titleColor: 'text-black',
                          arrowColor: '#016e71',
                          buttonBg: 'bg-[#333333]',
                          buttonHover: 'hover:bg-[#555555]',
                          categoryBg: 'bg-[#4062B9] text-white border-[#4062B9]'
                        };
                      case 'Technical':
                        return {
                          bgColor: 'bg-white',
                          borderColor: 'border-gray-200',
                          titleColor: 'text-black',
                          arrowColor: '#f58c21',
                          buttonBg: 'bg-[#333333]',
                          buttonHover: 'hover:bg-[#555555]',
                          categoryBg: 'bg-[#ED2A10] text-white border-[#ED2A10]'
                        };
                      case 'Soft Skills':
                        return {
                          bgColor: 'bg-white',
                          borderColor: 'border-gray-200',
                          titleColor: 'text-black',
                          arrowColor: '#ed2a10',
                          buttonBg: 'bg-[#333333]',
                          buttonHover: 'hover:bg-[#555555]',
                          categoryBg: 'bg-[#BB6BD9] text-white border-[#BB6BD9]'
                        };
                      case 'Career':
                        return {
                          bgColor: 'bg-white',
                          borderColor: 'border-gray-200',
                          titleColor: 'text-black',
                          arrowColor: '#1d1d1d',
                          buttonBg: 'bg-[#333333]',
                          buttonHover: 'hover:bg-[#555555]',
                          categoryBg: 'bg-[#EB9B07] text-white border-[#EB9B07]'
                        };
                      case 'Core Hospitality':
                        return {
                          bgColor: 'bg-white',
                          borderColor: 'border-gray-200',
                          titleColor: 'text-black',
                          arrowColor: '#8b5cf6',
                          buttonBg: 'bg-[#333333]',
                          buttonHover: 'hover:bg-[#555555]',
                          categoryBg: 'bg-[#D64EB8] text-white border-[#D64EB8]'
                        };
                      default:
                        return {
                          bgColor: 'bg-white',
                          borderColor: 'border-gray-200',
                          titleColor: 'text-black',
                          arrowColor: '#6b7280',
                          buttonBg: 'bg-[#333333]',
                          buttonHover: 'hover:bg-[#555555]',
                          categoryBg: 'border-gray-200 text-gray-700'
                        };
                    }
                  };

                  const styles = getCardStyles();

                  return (
                    <div key={course.id} className={`relative rounded-xl ${styles.bgColor} border ${styles.borderColor} overflow-hidden hover:shadow-lg transition-shadow flex flex-col`}>
                      {course.thumbnailUrl && (
                        <div className="w-full aspect-video bg-gray-100 shrink-0">
                          <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex flex-col gap-4 flex-1 p-6">
                        <h3 className={`font-['DM_Sans',sans-serif] font-bold text-2xl tracking-tight ${styles.titleColor}`}>{course.title}</h3>
                        <p className="font-['DM_Sans',sans-serif] text-black text-lg">{course.description.length > 120 ? course.description.slice(0, 120) + '...' : course.description}</p>

                        <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                          <div className="flex items-center gap-2">
                            <img src="/ClockCountdown.svg" alt="Duration" className="w-4 h-4 filter brightness-0 opacity-50" />
                            <span>{course.duration}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {course.level === 'Beginner' ? (
                              <img src="/StackSimple.svg" alt="Beginner" className="w-4 h-4 filter brightness-0 opacity-50" />
                            ) : course.level === 'Intermediate' ? (
                              <img src="/Stack.svg" alt="Intermediate" className="w-4 h-4 filter brightness-0 opacity-50" />
                            ) : course.level === 'Advanced' ? (
                              <img src="/Star.svg" alt="Advanced" className="w-4 h-4 filter brightness-0 opacity-50" />
                            ) : (
                              <span>📚</span>
                            )}
                            <span>{course.level}</span>
                            <span className={`text-xs px-3 py-1 rounded-full border whitespace-nowrap ${styles.categoryBg}`}>
                              {course.category}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-auto">
                          <div className={`font-['DM_Sans',sans-serif] font-bold text-2xl ${styles.titleColor}`}>
                            {course.price === 'Free' ? 'Free' : course.price ? `₦${course.price}` : ''}
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => { setEditingCourse(course); setShowCourseWizard(true); }}
                              className={`${styles.buttonBg} text-white px-4 py-2 rounded-lg ${styles.buttonHover} transition-colors font-['DM_Sans',sans-serif] font-bold text-sm`}
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteCourse(course.id)}
                              className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
                ) : (
                  <div className="col-span-full text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="font-['DM_Sans',sans-serif] font-semibold text-lg text-gray-900 mb-2">
                      No courses found
                    </h3>
                    <p className="font-['DM_Sans',sans-serif] text-gray-600 mb-4">
                      Try adjusting your search or filters to find what you're looking for.
                    </p>
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setFilterCategory('all');
                        setFilterLevel('all');
                      }}
                      className="bg-[#0d9488] text-white px-6 py-2 rounded-lg hover:bg-[#0a7a70] transition-colors font-['DM_Sans',sans-serif] font-medium"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Course Creation Screen */}
          {activeSection === 'courses' && showCourseWizard && (
            <div className="p-6">
              <nav className="flex items-center gap-2 text-sm mb-4 font-['DM_Sans',sans-serif]">
                <button
                  onClick={() => { setShowCourseWizard(false); setEditingCourse(null); }}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Admin Dashboard
                </button>
                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                <span className="text-gray-900 font-medium">{editingCourse ? 'Edit Course' : 'Create New Course'}</span>
              </nav>

              <CourseCreationWizard
                onClose={() => { setShowCourseWizard(false); setEditingCourse(null); }}
                onSave={handleCourseSave}
                editingCourse={editingCourse}
              />
            </div>
          )}

          {activeSection === 'jobs' && <JobOpenings />}
          {activeSection === 'learners' && <LearnersSection />}
          {activeSection === 'contact' && (
            <div className="p-6">
              <ContactSubmissionsSection />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

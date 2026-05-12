import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import coursesData, { Course, Module, Lesson } from '../data/courseContent';
import { fetchCourses } from '../../lib/courseService';
import { downloadCertificate, CertificatePreview } from '../components/CertificateGenerator';
import { progressTracker } from '../utils/progressTracking';
import { useAuth } from '../context/AuthContext';

// Header Component
function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setDropdownOpen(false);
    await signOut();
    navigate('/');
  };

  const initial = user?.email?.[0].toUpperCase() ?? '';

  return (
    <header className="fixed top-0 left-0 right-0 w-full bg-white z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="h-16 w-32">
            <img alt="CR8Careers Logo" className="h-full w-full object-contain" src="/logo.png" />
          </Link>
          <nav className="hidden md:flex gap-8 items-center">
            <Link to="/" className="font-['DM_Sans',sans-serif] text-[#1d1d1d] text-sm hover:text-[#ed2a10] transition-colors">Home</Link>
            <Link to="/courses" className="font-['DM_Sans',sans-serif] text-[#1d1d1d] text-sm hover:text-[#ed2a10] transition-colors">Courses</Link>
            <Link to="/contact" className="font-['DM_Sans',sans-serif] text-[#1d1d1d] text-sm hover:text-[#ed2a10] transition-colors">Contact</Link>
          </nav>
          <div className="flex items-center gap-3">
            {user && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(o => !o)}
                  className="w-10 h-10 rounded-full bg-[#333333] text-white flex items-center justify-center font-['DM_Sans',sans-serif] font-bold text-sm hover:bg-[#555555] transition-colors"
                  title={user.email ?? ''}
                >
                  {initial}
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-['DM_Sans',sans-serif] text-xs text-gray-400">Signed in as</p>
                      <p className="font-['DM_Sans',sans-serif] text-sm font-semibold text-gray-800 truncate">{user.email}</p>
                    </div>
                    <Link to="/courses" onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 font-['DM_Sans',sans-serif] text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      My Courses
                    </Link>
                    <button onClick={handleSignOut} className="w-full text-left px-4 py-2.5 font-['DM_Sans',sans-serif] text-sm text-red-600 hover:bg-red-50 transition-colors">
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function QuizComponent({ lesson, onComplete }: { lesson: Lesson; onComplete: () => void }) {
  const questions = lesson.quizQuestions ?? [];
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);

  if (questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg text-center">
        <p className="font-['DM_Sans',sans-serif] text-gray-500">No questions have been added to this quiz yet.</p>
        <button onClick={onComplete} className="mt-4 bg-[#0d9488] text-white px-6 py-2 rounded-lg font-['DM_Sans',sans-serif] font-bold hover:bg-[#0a7a70]">Continue</button>
      </div>
    );
  }

  const q = questions[currentQuestion];
  const isMulti = q.type === 'multi';

  const toggleOption = (optionId: string) => {
    if (submitted) return;
    if (isMulti) {
      setSelectedOptions(prev =>
        prev.includes(optionId) ? prev.filter(id => id !== optionId) : [...prev, optionId]
      );
    } else {
      setSelectedOptions([optionId]);
    }
  };

  const handleSubmit = () => {
    if (selectedOptions.length === 0) return;
    const correct = q.correctAnswers ?? [];
    const isCorrect =
      selectedOptions.length === correct.length &&
      selectedOptions.every(id => correct.includes(id));
    const newResults = [...results, isCorrect];
    setResults(newResults);
    setSubmitted(true);
  };

  const handleNext = () => {
    setSubmitted(false);
    setSelectedOptions([]);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  if (showResults) {
    const correct = results.filter(Boolean).length;
    const score = Math.round((correct / questions.length) * 100);
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg">
        <h3 className="font-['DM_Sans',sans-serif] font-bold text-2xl mb-6">Quiz Results</h3>
        <div className="text-center mb-6">
          <div className="text-6xl font-bold text-[#0d9488] mb-2">{score}%</div>
          <p className="font-['DM_Sans',sans-serif] text-lg text-gray-600">
            {correct} of {questions.length} correct
          </p>
          <p className="font-['DM_Sans',sans-serif] text-lg mt-2 font-medium">
            {score >= 70 ? 'Congratulations! You passed!' : 'Keep practicing and try again!'}
          </p>
        </div>
        <button
          onClick={onComplete}
          className="w-full bg-[#0d9488] text-white py-3 rounded-lg hover:bg-[#0a7a70] transition-colors font-['DM_Sans',sans-serif] font-bold"
        >
          Continue to Next Lesson
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="font-['DM_Sans',sans-serif] text-sm text-gray-500">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <div className="w-full bg-gray-200 rounded-full h-2 ml-4">
            <div
              className="bg-[#0d9488] h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
        {isMulti && (
          <p className="text-xs text-gray-400 mb-2 font-['DM_Sans',sans-serif]">Select all that apply</p>
        )}
        <h3 className="font-['DM_Sans',sans-serif] font-bold text-xl mb-6">{q.question}</h3>
      </div>

      <div className="space-y-3 mb-6">
        {q.options.map(option => {
          const selected = selectedOptions.includes(option.id);
          const isCorrect = (q.correctAnswers ?? []).includes(option.id);
          let optionClass = 'w-full text-left p-4 border rounded-lg transition-colors font-["DM_Sans",sans-serif]';
          if (submitted) {
            if (isCorrect) optionClass += ' border-green-500 bg-green-50 text-green-800';
            else if (selected) optionClass += ' border-red-400 bg-red-50 text-red-700';
            else optionClass += ' border-gray-200 text-gray-500';
          } else {
            optionClass += selected
              ? ' border-[#0d9488] bg-[#f0fdf4]'
              : ' border-gray-300 hover:border-[#0d9488] hover:bg-[#f0fdf4]';
          }
          return (
            <button key={option.id} onClick={() => toggleOption(option.id)} className={optionClass}>
              <span className="font-['DM_Sans',sans-serif]">{option.text}</span>
            </button>
          );
        })}
      </div>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={selectedOptions.length === 0}
          className={`w-full py-3 rounded-lg font-['DM_Sans',sans-serif] font-bold transition-colors ${
            selectedOptions.length === 0
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-[#ed2a10] text-white hover:bg-[#d42610]'
          }`}
        >
          Submit Answer
        </button>
      ) : (
        <button
          onClick={handleNext}
          className="w-full py-3 rounded-lg bg-[#0d9488] text-white font-['DM_Sans',sans-serif] font-bold hover:bg-[#0a7a70] transition-colors"
        >
          {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}
        </button>
      )}
    </div>
  );
}

function CertificateModal({ 
  isOpen, 
  onClose, 
  course, 
  userName 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  course: Course; 
  userName: string; 
}) {
  if (!isOpen) return null;

  const handleDownload = () => {
    downloadCertificate(course, userName);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl p-8 max-w-6xl w-full relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <CertificatePreview 
          course={course} 
          userName={userName} 
          onDownload={handleDownload}
        />
        
        <div className="flex gap-4 justify-center mt-6">
          <button
            onClick={onClose}
            className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-['DM_Sans',sans-serif] font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CoursePlayerPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [currentModule, setCurrentModule] = useState(0);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [showCertificate, setShowCertificate] = useState(false);
  const userName = user?.email?.split('@')[0] ?? 'Learner';

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate(`/login?redirect=/course/${courseId}`); return; }
    if (!courseId) { navigate('/courses'); return; }

    const loadCourse = async () => {
      // Try Supabase first, fall back to static data
      let found: Course | null = null;
      const { data } = await fetchCourses();
      const row = data.find(r => r.id === courseId);
      if (row) {
        found = {
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
        };
      } else {
        found = coursesData.find(c => c.id === courseId) ?? null;
      }

      if (!found) { navigate('/courses'); return; }

      setCourse(found);
      if (!progressTracker.isEnrolled(courseId)) {
        progressTracker.enrollInCourse(courseId, found);
      }
      const progress = progressTracker.getCourseProgress(courseId);
      if (progress) {
        setCompletedLessons(new Set(progress.completedLessons));
        if (progress.currentLesson) {
          const foundModule = found.modules.find(m =>
            m.lessons.some(l => l.id === progress.currentLesson)
          );
          if (foundModule) {
            setCurrentModule(found.modules.indexOf(foundModule));
            setCurrentLesson(foundModule.lessons.findIndex(l => l.id === progress.currentLesson));
          }
        }
        if (progress.completed) setShowCertificate(true);
      }
    };

    loadCourse();
  }, [courseId, navigate]);

  const markLessonComplete = (lessonId: string) => {
    if (course && courseId) {
      progressTracker.completeLesson(courseId, lessonId, course);
      const progress = progressTracker.getCourseProgress(courseId);
      if (progress) {
        setCompletedLessons(new Set(progress.completedLessons));
        
        // Check if course is complete
        const totalLessons = course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0);
        if (progress.completedLessons.length === totalLessons) {
          setShowCertificate(true);
        }
      }
    }
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-24 flex items-center justify-center">
          <p className="font-['DM_Sans',sans-serif] text-lg">Loading course...</p>
        </div>
      </div>
    );
  }

  const currentModuleData = course.modules[currentModule];
  const currentLessonData = currentModuleData.lessons[currentLesson];
  const progress = (completedLessons.size / course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0)) * 100;

  // Helper function to check if a lesson is unlocked
  const isLessonUnlocked = (moduleIndex: number, lessonIndex: number): boolean => {
    const lessonId = course.modules[moduleIndex].lessons[lessonIndex].id;
    
    // A lesson is unlocked if:
    // 1. It's the first lesson
    // 2. It's already been completed (always accessible for review)
    // 3. The previous lesson is completed
    
    if (moduleIndex === 0 && lessonIndex === 0) return true;
    if (completedLessons.has(lessonId)) return true;
    
    // Find the previous lesson
    let prevModule = moduleIndex;
    let prevLesson = lessonIndex - 1;
    
    if (prevLesson < 0) {
      // Moving to previous module's last lesson
      prevModule = moduleIndex - 1;
      if (prevModule < 0) return true;
      prevLesson = course.modules[prevModule].lessons.length - 1;
    }
    
    const prevLessonId = course.modules[prevModule].lessons[prevLesson].id;
    
    // Lesson is unlocked if previous lesson is completed
    return completedLessons.has(prevLessonId);
  };

  const handleNextLesson = () => {
    markLessonComplete(currentLessonData.id);
    
    let nextModule = currentModule;
    let nextLesson = currentLesson;
    
    if (currentLesson < currentModuleData.lessons.length - 1) {
      nextLesson = currentLesson + 1;
    } else if (currentModule < course.modules.length - 1) {
      nextModule = currentModule + 1;
      nextLesson = 0;
    } else {
      // Course completed
      setShowCertificate(true);
      return;
    }
    
    // Update progress tracker
    if (courseId) {
      const nextModuleData = course.modules[nextModule];
      const nextLessonData = nextModuleData.lessons[nextLesson];
      progressTracker.updateCurrentLesson(courseId, nextLessonData.id, nextModuleData.id);
    }
    
    setCurrentModule(nextModule);
    setCurrentLesson(nextLesson);
  };

  const handlePreviousLesson = () => {
    let prevModule = currentModule;
    let prevLesson = currentLesson;
    
    if (currentLesson > 0) {
      prevLesson = currentLesson - 1;
    } else if (currentModule > 0) {
      prevModule = currentModule - 1;
      prevLesson = course.modules[prevModule].lessons.length - 1;
    }
    
    // Update progress tracker
    if (courseId) {
      const prevModuleData = course.modules[prevModule];
      const prevLessonData = prevModuleData.lessons[prevLesson];
      progressTracker.updateCurrentLesson(courseId, prevLessonData.id, prevModuleData.id);
    }
    
    setCurrentModule(prevModule);
    setCurrentLesson(prevLesson);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20 flex">
        {/* Sidebar */}
        <div className="w-80 bg-white h-screen overflow-y-auto border-r border-gray-200">
          <div className="p-6">
            <h2 className="font-['DM_Sans',sans-serif] font-bold text-xl mb-4">{course.title}</h2>
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-['DM_Sans',sans-serif]">Progress</span>
                <span className="font-['DM_Sans',sans-serif] font-bold">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-[#0d9488] h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-6 p-3 bg-blue-50 rounded-lg text-xs text-blue-700">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-['DM_Sans',sans-serif]">Complete lessons to unlock the next one</span>
            </div>
            
            <div className="space-y-4">
              {course.modules.map((module, moduleIndex) => (
                <div key={module.id} className="border border-gray-200 rounded-lg">
                  <div className="p-3 bg-gray-50 border-b border-gray-200">
                    <h3 className="font-['DM_Sans',sans-serif] font-semibold text-sm">
                      {module.title}
                    </h3>
                    <p className="font-['DM_Sans',sans-serif] text-xs text-gray-600 mt-1">
                      {module.lessons.length} lessons
                    </p>
                  </div>
                  <div className="p-2">
                    {module.lessons.map((lesson, lessonIndex) => {
                      const isCurrent = moduleIndex === currentModule && lessonIndex === currentLesson;
                      const isCompleted = completedLessons.has(lesson.id);
                      const lessonUnlocked = isLessonUnlocked(moduleIndex, lessonIndex);
                      const isLocked = !isCompleted && !isCurrent && !lessonUnlocked;
                      
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => {
                            // Allow navigation if: current lesson, completed lesson, or unlocked lesson
                            if (isCurrent || isCompleted || lessonUnlocked) {
                              setCurrentModule(moduleIndex);
                              setCurrentLesson(lessonIndex);
                              if (courseId) {
                                progressTracker.updateCurrentLesson(courseId, lesson.id, module.id);
                              }
                            }
                          }}
                          className={`w-full text-left p-3 rounded-md mb-1 transition-colors ${
                            isCurrent 
                              ? 'bg-[#0d9488] text-white' 
                              : isCompleted 
                                ? 'bg-green-50 text-green-700 hover:bg-green-100 cursor-pointer'
                                : isLocked
                                  ? 'bg-gray-50 text-gray-400 cursor-not-allowed pointer-events-none'
                                  : 'hover:bg-gray-100 cursor-pointer'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {isCompleted ? (
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : isLocked ? (
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                            ) : null}
                            <span className="font-['DM_Sans',sans-serif] text-sm">
                              {lesson.title}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumbs */}
            <div className="mb-6">
              <div className="flex items-center text-sm">
                <Link to="/courses" className="text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 2 2m-9 5l7-7 2 2M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  All Courses
                </Link>
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="font-['DM_Sans',sans-serif] text-gray-700">{course?.title}</span>
              </div>
            </div>
            
            <div className="mb-6">
              <h1 className="font-['DM_Sans',sans-serif] font-bold text-2xl mb-2">
                {currentLessonData.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="font-['DM_Sans',sans-serif]">
                  Module {currentModule + 1}: {currentModuleData.title}
                </span>
                <span className="font-['DM_Sans',sans-serif]">•</span>
                <span className="font-['DM_Sans',sans-serif]">{currentLessonData.duration}</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
              {currentLessonData.type === 'quiz' ? (
                <QuizComponent 
                  lesson={currentLessonData} 
                  onComplete={handleNextLesson}
                />
              ) : (
                <div
                  className="prose max-w-none font-['DM_Sans',sans-serif] text-gray-700 leading-relaxed rich-content"
                  dangerouslySetInnerHTML={{ __html: currentLessonData.content }}
                />
              )}
            </div>

            {currentLessonData.type !== 'quiz' && (
              <div className="flex justify-between items-center">
                <button
                  onClick={handlePreviousLesson}
                  disabled={currentModule === 0 && currentLesson === 0}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-['DM_Sans',sans-serif] font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous Lesson
                </button>
                
                {!completedLessons.has(currentLessonData.id) && (
                  <div className="text-sm text-gray-500 font-['DM_Sans',sans-serif]">
                    Complete this lesson to unlock the next one
                  </div>
                )}
                
                <button
                  onClick={handleNextLesson}
                  className="px-6 py-3 bg-[#0d9488] text-white rounded-lg hover:bg-[#0a7a70] transition-colors font-['DM_Sans',sans-serif] font-bold"
                >
                  {currentModule === course.modules.length - 1 && currentLesson === currentModuleData.lessons.length - 1 
                    ? 'Complete Course' 
                    : completedLessons.has(currentLessonData.id) 
                      ? 'Continue to Next Lesson'
                      : 'Mark Complete & Continue'
                  }
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <CertificateModal 
        isOpen={showCertificate}
        onClose={() => setShowCertificate(false)}
        course={course}
        userName={userName}
      />
    </div>
  );
}

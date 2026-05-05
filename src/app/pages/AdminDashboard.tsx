import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import coursesData, { Course, Module, Lesson } from '../data/courseContent';
import { progressTracker } from '../utils/progressTracking';
import { FileUpload, FileManager } from '../components/FileUpload';
import { QuizBuilder } from '../components/QuizBuilder';

// Header Component
function Header() {
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
            <Link to="/admin" className="font-['DM_Sans',sans-serif] text-[#ed2a10] text-sm font-bold">Admin</Link>
            <Link to="/contact" className="font-['DM_Sans',sans-serif] text-[#1d1d1d] text-sm hover:text-[#ed2a10] transition-colors">Contact</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

interface CourseFormData {
  title: string;
  description: string;
  duration: string;
  level: string;
  price: string;
  category: string;
  instructor: string;
}

interface ModuleFormData {
  title: string;
  description: string;
}

interface LessonFormData {
  title: string;
  content: string;
  duration: string;
  type: 'video' | 'text' | 'quiz' | 'assignment';
}

interface UploadedFile {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadDate: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'courses' | 'modules' | 'lessons' | 'users'>('courses');
  const [courses, setCourses] = useState<Course[]>(coursesData);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [lessonFormTab, setLessonFormTab] = useState<'content' | 'files' | 'quiz'>('content');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [showQuizBuilder, setShowQuizBuilder] = useState(false);
  const navigate = useNavigate();

  // Form states
  const [courseForm, setCourseForm] = useState<CourseFormData>({
    title: '',
    description: '',
    duration: '',
    level: 'Beginner',
    price: '',
    category: 'Leadership',
    instructor: ''
  });

  const [moduleForm, setModuleForm] = useState<ModuleFormData>({
    title: '',
    description: ''
  });

  const [lessonForm, setLessonForm] = useState<LessonFormData>({
    title: '',
    content: '',
    duration: '',
    type: 'text'
  });

  // Check if user is admin (simple authentication)
  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (!isAdmin) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCourse) {
      // Update existing course
      const updatedCourses = courses.map(course => 
        course.id === editingCourse.id 
          ? { ...course, ...courseForm }
          : course
      );
      setCourses(updatedCourses);
      setEditingCourse(null);
    } else {
      // Create new course
      const newCourse: Course = {
        id: 'course-' + Date.now(),
        ...courseForm,
        modules: [],
        finalAssessment: {
          questions: [],
          passingScore: 70
        }
      };
      setCourses([...courses, newCourse]);
    }

    setCourseForm({
      title: '',
      description: '',
      duration: '',
      level: 'Beginner',
      price: '',
      category: 'Leadership',
      instructor: ''
    });
    setShowCourseForm(false);
  };

  const handleModuleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCourse) return;

    if (editingModule) {
      // Update existing module
      const updatedCourse = {
        ...selectedCourse,
        modules: selectedCourse.modules.map(module =>
          module.id === editingModule.id
            ? { ...module, ...moduleForm }
            : module
        )
      };
      setCourses(courses.map(course => 
        course.id === selectedCourse.id ? updatedCourse : course
      ));
      setSelectedCourse(updatedCourse);
      setEditingModule(null);
    } else {
      // Create new module
      const newModule: Module = {
        id: 'mod-' + Date.now(),
        ...moduleForm,
        lessons: []
      };
      const updatedCourse = {
        ...selectedCourse,
        modules: [...selectedCourse.modules, newModule]
      };
      setCourses(courses.map(course => 
        course.id === selectedCourse.id ? updatedCourse : course
      ));
      setSelectedCourse(updatedCourse);
    }

    setModuleForm({ title: '', description: '' });
    setShowModuleForm(false);
  };

  const handleLessonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCourse || !selectedModule) return;

    if (editingLesson) {
      // Update existing lesson
      const updatedCourse = {
        ...selectedCourse,
        modules: selectedCourse.modules.map(module =>
          module.id === selectedModule.id
            ? {
                ...module,
                lessons: module.lessons.map(lesson =>
                  lesson.id === editingLesson.id
                    ? { ...lesson, ...lessonForm }
                    : lesson
                )
              }
            : module
        )
      };
      setCourses(courses.map(course => 
        course.id === selectedCourse.id ? updatedCourse : course
      ));
      setSelectedCourse(updatedCourse);
      setEditingLesson(null);
    } else {
      // Create new lesson
      const newLesson: Lesson = {
        id: 'lesson-' + Date.now(),
        ...lessonForm
      };
      const updatedCourse = {
        ...selectedCourse,
        modules: selectedCourse.modules.map(module =>
          module.id === selectedModule.id
            ? { ...module, lessons: [...module.lessons, newLesson] }
            : module
        )
      };
      setCourses(courses.map(course => 
        course.id === selectedCourse.id ? updatedCourse : course
      ));
      setSelectedCourse(updatedCourse);
    }

    setLessonForm({
      title: '',
      content: '',
      duration: '',
      type: 'text'
    });
    setShowLessonForm(false);
  };

  const deleteCourse = (courseId: string) => {
    if (confirm('Are you sure you want to delete this course?')) {
      setCourses(courses.filter(course => course.id !== courseId));
      if (selectedCourse?.id === courseId) {
        setSelectedCourse(null);
      }
    }
  };

  const deleteModule = (moduleId: string) => {
    if (!selectedCourse) return;
    
    if (confirm('Are you sure you want to delete this module?')) {
      const updatedCourse = {
        ...selectedCourse,
        modules: selectedCourse.modules.filter(module => module.id !== moduleId)
      };
      setCourses(courses.map(course => 
        course.id === selectedCourse.id ? updatedCourse : course
      ));
      setSelectedCourse(updatedCourse);
    }
  };

  const deleteLesson = (lessonId: string) => {
    if (!selectedCourse || !selectedModule) return;
    
    if (confirm('Are you sure you want to delete this lesson?')) {
      const updatedCourse = {
        ...selectedCourse,
        modules: selectedCourse.modules.map(module =>
          module.id === selectedModule.id
            ? { ...module, lessons: module.lessons.filter(lesson => lesson.id !== lessonId) }
            : module
        )
      };
      setCourses(courses.map(course => 
        course.id === selectedCourse.id ? updatedCourse : course
      ));
      setSelectedCourse(updatedCourse);
    }
  };

  const editCourse = (course: Course) => {
    setEditingCourse(course);
    setCourseForm({
      title: course.title,
      description: course.description,
      duration: course.duration,
      level: course.level,
      price: course.price,
      category: course.category,
      instructor: course.instructor
    });
    setShowCourseForm(true);
  };

  const editModule = (module: Module) => {
    setEditingModule(module);
    setModuleForm({
      title: module.title,
      description: module.description
    });
    setShowModuleForm(true);
  };

  const editLesson = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setLessonForm({
      title: lesson.title,
      content: lesson.content,
      duration: lesson.duration,
      type: lesson.type
    });
    setLessonFormTab('content');
    setShowLessonForm(true);
  };

  const handleFileUpload = (file: File, url: string) => {
    const newFile: UploadedFile = {
      id: 'file-' + Date.now(),
      name: file.name,
      url: url,
      size: file.size,
      type: file.type,
      uploadDate: new Date().toISOString()
    };
    setUploadedFiles([...uploadedFiles, newFile]);
  };

  const handleFileDelete = (fileId: string) => {
    setUploadedFiles(uploadedFiles.filter(file => file.id !== fileId));
  };

  const handleQuizCreate = (quiz: any) => {
    // Convert quiz to lesson content format
    const quizContent = `# Quiz: ${quiz.title}\n\n${quiz.description}\n\n**Time Limit:** ${quiz.timeLimit} minutes\n**Passing Score:** ${quiz.passingScore}%\n\n## Questions:\n${quiz.questions.map((q: any, index: number) => 
      `${index + 1}. ${q.question}\n${q.options ? q.options.map((opt: string, i: number) => 
        `   ${String.fromCharCode(65 + i)}. ${opt}`).join('\n') : ''}\n   **Answer:** ${q.type === 'multiple-choice' ? String.fromCharCode(65 + q.correctAnswer) : q.correctAnswer}\n   **Points:** ${q.points}`
    ).join('\n\n')}`;
    
    setLessonForm({
      ...lessonForm,
      content: quizContent,
      type: 'quiz'
    });
    setShowQuizBuilder(false);
    setLessonFormTab('content');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Admin Header */}
          <div className="mb-8">
            <h1 className="font-['DM_Sans',sans-serif] font-bold text-3xl text-[#1d1d1d] mb-2">
              Admin Dashboard
            </h1>
            <p className="font-['DM_Sans',sans-serif] text-gray-600">
              Manage courses, modules, lessons, and users
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="flex space-x-8">
              {[
                { id: 'courses', label: 'Courses', count: courses.length },
                { id: 'modules', label: 'Modules', count: selectedCourse?.modules.length || 0 },
                { id: 'lessons', label: 'Lessons', count: selectedModule?.lessons.length || 0 },
                { id: 'users', label: 'Users', count: 0 }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2 px-1 border-b-2 font-['DM_Sans',sans-serif] text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-[#ed2a10] text-[#ed2a10]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Courses Tab */}
          {activeTab === 'courses' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-['DM_Sans',sans-serif] font-bold text-xl text-[#1d1d1d]">
                  Course Management
                </h2>
                <button
                  onClick={() => setShowCourseForm(true)}
                  className="bg-[#ed2a10] text-white px-4 py-2 rounded-lg hover:bg-[#d42610] transition-colors font-['DM_Sans',sans-serif] font-semibold"
                >
                  Add New Course
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div key={course.id} className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-['DM_Sans',sans-serif] font-bold text-lg text-[#1d1d1d]">
                        {course.title}
                      </h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => editCourse(course)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteCourse(course.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p className="font-['DM_Sans',sans-serif] text-gray-600 mb-4">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>{course.duration}</span>
                      <span>{course.level}</span>
                      <span>{course.price}</span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedCourse(course);
                        setActiveTab('modules');
                      }}
                      className="w-full bg-[#0d9488] text-white py-2 rounded-lg hover:bg-[#0a7a70] transition-colors font-['DM_Sans',sans-serif] font-semibold"
                    >
                      Manage Modules ({course.modules.length})
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Modules Tab */}
          {activeTab === 'modules' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="font-['DM_Sans',sans-serif] font-bold text-xl text-[#1d1d1d]">
                    Module Management
                  </h2>
                  {selectedCourse && (
                    <p className="font-['DM_Sans',sans-serif] text-gray-600">
                      Course: {selectedCourse.title}
                    </p>
                  )}
                </div>
                <div className="flex gap-3">
                  {selectedCourse && (
                    <button
                      onClick={() => setShowModuleForm(true)}
                      className="bg-[#ed2a10] text-white px-4 py-2 rounded-lg hover:bg-[#d42610] transition-colors font-['DM_Sans',sans-serif] font-semibold"
                    >
                      Add New Module
                    </button>
                  )}
                  <select
                    value={selectedCourse?.id || ''}
                    onChange={(e) => {
                      const course = courses.find(c => c.id === e.target.value);
                      setSelectedCourse(course || null);
                    }}
                    className="border border-gray-300 rounded-lg px-4 py-2 font-['DM_Sans',sans-serif]"
                  >
                    <option value="">Select Course</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedCourse ? (
                <div className="space-y-4">
                  {selectedCourse.modules.map((module) => (
                    <div key={module.id} className="bg-white rounded-xl shadow-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-['DM_Sans',sans-serif] font-bold text-lg text-[#1d1d1d]">
                            {module.title}
                          </h3>
                          <p className="font-['DM_Sans',sans-serif] text-gray-600">
                            {module.description}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => editModule(module)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteModule(module.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedModule(module);
                          setActiveTab('lessons');
                        }}
                        className="bg-[#0d9488] text-white px-4 py-2 rounded-lg hover:bg-[#0a7a70] transition-colors font-['DM_Sans',sans-serif] font-semibold"
                      >
                        Manage Lessons ({module.lessons.length})
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                  <p className="font-['DM_Sans',sans-serif] text-gray-600">
                    Please select a course to manage its modules
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Lessons Tab */}
          {activeTab === 'lessons' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="font-['DM_Sans',sans-serif] font-bold text-xl text-[#1d1d1d]">
                    Lesson Management
                  </h2>
                  {selectedCourse && selectedModule && (
                    <p className="font-['DM_Sans',sans-serif] text-gray-600">
                      Course: {selectedCourse.title} → Module: {selectedModule.title}
                    </p>
                  )}
                </div>
                <div className="flex gap-3">
                  {selectedCourse && selectedModule && (
                    <button
                      onClick={() => setShowLessonForm(true)}
                      className="bg-[#ed2a10] text-white px-4 py-2 rounded-lg hover:bg-[#d42610] transition-colors font-['DM_Sans',sans-serif] font-semibold"
                    >
                      Add New Lesson
                    </button>
                  )}
                  <select
                    value={selectedCourse?.id || ''}
                    onChange={(e) => {
                      const course = courses.find(c => c.id === e.target.value);
                      setSelectedCourse(course || null);
                      setSelectedModule(null);
                    }}
                    className="border border-gray-300 rounded-lg px-4 py-2 font-['DM_Sans',sans-serif]"
                  >
                    <option value="">Select Course</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedModule?.id || ''}
                    onChange={(e) => {
                      const module = selectedCourse?.modules.find(m => m.id === e.target.value);
                      setSelectedModule(module || null);
                    }}
                    disabled={!selectedCourse}
                    className="border border-gray-300 rounded-lg px-4 py-2 font-['DM_Sans',sans-serif] disabled:opacity-50"
                  >
                    <option value="">Select Module</option>
                    {selectedCourse?.modules.map(module => (
                      <option key={module.id} value={module.id}>
                        {module.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedModule ? (
                <div className="space-y-4">
                  {selectedModule.lessons.map((lesson) => (
                    <div key={lesson.id} className="bg-white rounded-xl shadow-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-['DM_Sans',sans-serif] font-bold text-lg text-[#1d1d1d]">
                            {lesson.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                            <span>Type: {lesson.type}</span>
                            <span>Duration: {lesson.duration}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => editLesson(lesson)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteLesson(lesson.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <div className="text-gray-600">
                        {lesson.content.substring(0, 150)}...
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                  <p className="font-['DM_Sans',sans-serif] text-gray-600">
                    Please select a course and module to manage lessons
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="font-['DM_Sans',sans-serif] font-bold text-xl text-[#1d1d1d] mb-6">
                User Management
              </h2>
              <p className="font-['DM_Sans',sans-serif] text-gray-600">
                User management features coming soon...
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Course Form Modal */}
      {showCourseForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-screen overflow-y-auto">
            <h3 className="font-['DM_Sans',sans-serif] font-bold text-2xl mb-6">
              {editingCourse ? 'Edit Course' : 'Add New Course'}
            </h3>
            <form onSubmit={handleCourseSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block font-['DM_Sans',sans-serif] font-semibold text-gray-700 mb-2">
                    Course Title
                  </label>
                  <input
                    type="text"
                    required
                    value={courseForm.title}
                    onChange={(e) => setCourseForm({...courseForm, title: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 font-['DM_Sans',sans-serif]"
                  />
                </div>
                <div>
                  <label className="block font-['DM_Sans',sans-serif] font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    required
                    value={courseForm.description}
                    onChange={(e) => setCourseForm({...courseForm, description: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 font-['DM_Sans',sans-serif]"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-['DM_Sans',sans-serif] font-semibold text-gray-700 mb-2">
                      Duration
                    </label>
                    <input
                      type="text"
                      required
                      value={courseForm.duration}
                      onChange={(e) => setCourseForm({...courseForm, duration: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 font-['DM_Sans',sans-serif]"
                      placeholder="e.g., 6 weeks"
                    />
                  </div>
                  <div>
                    <label className="block font-['DM_Sans',sans-serif] font-semibold text-gray-700 mb-2">
                      Level
                    </label>
                    <select
                      value={courseForm.level}
                      onChange={(e) => setCourseForm({...courseForm, level: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 font-['DM_Sans',sans-serif]"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-['DM_Sans',sans-serif] font-semibold text-gray-700 mb-2">
                      Price
                    </label>
                    <input
                      type="text"
                      required
                      value={courseForm.price}
                      onChange={(e) => setCourseForm({...courseForm, price: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 font-['DM_Sans',sans-serif]"
                      placeholder="e.g., ₦75,000"
                    />
                  </div>
                  <div>
                    <label className="block font-['DM_Sans',sans-serif] font-semibold text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={courseForm.category}
                      onChange={(e) => setCourseForm({...courseForm, category: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 font-['DM_Sans',sans-serif]"
                    >
                      <option value="Leadership">Leadership</option>
                      <option value="Technical">Technical</option>
                      <option value="Soft Skills">Soft Skills</option>
                      <option value="Career">Career</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block font-['DM_Sans',sans-serif] font-semibold text-gray-700 mb-2">
                    Instructor
                  </label>
                  <input
                    type="text"
                    required
                    value={courseForm.instructor}
                    onChange={(e) => setCourseForm({...courseForm, instructor: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 font-['DM_Sans',sans-serif]"
                    placeholder="e.g., Dr. Sarah Johnson"
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-[#0d9488] text-white py-2 rounded-lg hover:bg-[#0a7a70] transition-colors font-['DM_Sans',sans-serif] font-semibold"
                >
                  {editingCourse ? 'Update Course' : 'Create Course'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCourseForm(false);
                    setEditingCourse(null);
                    setCourseForm({
                      title: '',
                      description: '',
                      duration: '',
                      level: 'Beginner',
                      price: '',
                      category: 'Leadership',
                      instructor: ''
                    });
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors font-['DM_Sans',sans-serif] font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Module Form Modal */}
      {showModuleForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full">
            <h3 className="font-['DM_Sans',sans-serif] font-bold text-2xl mb-6">
              {editingModule ? 'Edit Module' : 'Add New Module'}
            </h3>
            <form onSubmit={handleModuleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block font-['DM_Sans',sans-serif] font-semibold text-gray-700 mb-2">
                    Module Title
                  </label>
                  <input
                    type="text"
                    required
                    value={moduleForm.title}
                    onChange={(e) => setModuleForm({...moduleForm, title: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 font-['DM_Sans',sans-serif]"
                  />
                </div>
                <div>
                  <label className="block font-['DM_Sans',sans-serif] font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    required
                    value={moduleForm.description}
                    onChange={(e) => setModuleForm({...moduleForm, description: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 font-['DM_Sans',sans-serif]"
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-[#0d9488] text-white py-2 rounded-lg hover:bg-[#0a7a70] transition-colors font-['DM_Sans',sans-serif] font-semibold"
                >
                  {editingModule ? 'Update Module' : 'Create Module'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModuleForm(false);
                    setEditingModule(null);
                    setModuleForm({ title: '', description: '' });
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors font-['DM_Sans',sans-serif] font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lesson Form Modal */}
      {showLessonForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-4xl w-full max-h-screen overflow-y-auto">
            <h3 className="font-['DM_Sans',sans-serif] font-bold text-2xl mb-6">
              {editingLesson ? 'Edit Lesson' : 'Add New Lesson'}
            </h3>
            
            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setLessonFormTab('content')}
                  className={`py-2 px-1 border-b-2 font-['DM_Sans',sans-serif] text-sm font-medium transition-colors ${
                    lessonFormTab === 'content'
                      ? 'border-[#ed2a10] text-[#ed2a10]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Content
                </button>
                <button
                  onClick={() => setLessonFormTab('files')}
                  className={`py-2 px-1 border-b-2 font-['DM_Sans',sans-serif] text-sm font-medium transition-colors ${
                    lessonFormTab === 'files'
                      ? 'border-[#ed2a10] text-[#ed2a10]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Files ({uploadedFiles.length})
                </button>
                <button
                  onClick={() => setLessonFormTab('quiz')}
                  className={`py-2 px-1 border-b-2 font-['DM_Sans',sans-serif] text-sm font-medium transition-colors ${
                    lessonFormTab === 'quiz'
                      ? 'border-[#ed2a10] text-[#ed2a10]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Quiz Builder
                </button>
              </nav>
            </div>

            {/* Content Tab */}
            {lessonFormTab === 'content' && (
              <form onSubmit={handleLessonSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block font-['DM_Sans',sans-serif] font-semibold text-gray-700 mb-2">
                      Lesson Title
                    </label>
                    <input
                      type="text"
                      required
                      value={lessonForm.title}
                      onChange={(e) => setLessonForm({...lessonForm, title: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 font-['DM_Sans',sans-serif]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-['DM_Sans',sans-serif] font-semibold text-gray-700 mb-2">
                        Duration
                      </label>
                      <input
                        type="text"
                        required
                        value={lessonForm.duration}
                        onChange={(e) => setLessonForm({...lessonForm, duration: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 font-['DM_Sans',sans-serif]"
                        placeholder="e.g., 15 min"
                      />
                    </div>
                    <div>
                      <label className="block font-['DM_Sans',sans-serif] font-semibold text-gray-700 mb-2">
                        Type
                      </label>
                      <select
                        value={lessonForm.type}
                        onChange={(e) => setLessonForm({...lessonForm, type: e.target.value as any})}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 font-['DM_Sans',sans-serif]"
                      >
                        <option value="text">Text</option>
                        <option value="video">Video</option>
                        <option value="quiz">Quiz</option>
                        <option value="assignment">Assignment</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block font-['DM_Sans',sans-serif] font-semibold text-gray-700 mb-2">
                      Content
                    </label>
                    <textarea
                      required
                      value={lessonForm.content}
                      onChange={(e) => setLessonForm({...lessonForm, content: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 font-['DM_Sans',sans-serif]"
                      rows={8}
                      placeholder="Enter lesson content (supports markdown formatting)"
                    />
                  </div>
                </div>
                <div className="flex gap-4 mt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-[#0d9488] text-white py-2 rounded-lg hover:bg-[#0a7a70] transition-colors font-['DM_Sans',sans-serif] font-semibold"
                  >
                    {editingLesson ? 'Update Lesson' : 'Create Lesson'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowLessonForm(false);
                      setEditingLesson(null);
                      setLessonForm({
                        title: '',
                        content: '',
                        duration: '',
                        type: 'text'
                      });
                      setUploadedFiles([]);
                    }}
                    className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors font-['DM_Sans',sans-serif] font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Files Tab */}
            {lessonFormTab === 'files' && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-['DM_Sans',sans-serif] font-semibold text-gray-700 mb-4">
                    Upload Files
                  </h4>
                  <FileUpload
                    onFileUpload={handleFileUpload}
                    accept="image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx"
                    maxSize={50}
                    label="Upload Course Materials"
                    multiple={true}
                  />
                </div>
                
                <div>
                  <h4 className="font-['DM_Sans',sans-serif] font-semibold text-gray-700 mb-4">
                    Uploaded Files
                  </h4>
                  <FileManager
                    files={uploadedFiles}
                    onFileDelete={handleFileDelete}
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setLessonFormTab('content')}
                    className="flex-1 bg-[#0d9488] text-white py-2 rounded-lg hover:bg-[#0a7a70] transition-colors font-['DM_Sans',sans-serif] font-semibold"
                  >
                    Back to Content
                  </button>
                  <button
                    onClick={() => {
                      setShowLessonForm(false);
                      setEditingLesson(null);
                      setLessonForm({
                        title: '',
                        content: '',
                        duration: '',
                        type: 'text'
                      });
                      setUploadedFiles([]);
                    }}
                    className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors font-['DM_Sans',sans-serif] font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Quiz Tab */}
            {lessonFormTab === 'quiz' && (
              <div className="space-y-6">
                {!showQuizBuilder ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-[#0d9488] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-[#0d9488]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                    </div>
                    <h4 className="font-['DM_Sans',sans-serif] font-bold text-lg text-gray-900 mb-2">
                      Quiz Builder
                    </h4>
                    <p className="font-['DM_Sans',sans-serif] text-gray-600 mb-6">
                      Create interactive quizzes with multiple question types
                    </p>
                    <button
                      onClick={() => setShowQuizBuilder(true)}
                      className="bg-[#0d9488] text-white px-6 py-3 rounded-lg hover:bg-[#0a7a70] transition-colors font-['DM_Sans',sans-serif] font-semibold"
                    >
                      Create Quiz
                    </button>
                  </div>
                ) : (
                  <QuizBuilder
                    onQuizCreate={handleQuizCreate}
                    initialQuiz={lessonForm.type === 'quiz' ? {
                      title: lessonForm.title,
                      description: '',
                      timeLimit: 30,
                      passingScore: 70,
                      questions: []
                    } : undefined}
                  />
                )}

                {!showQuizBuilder && (
                  <div className="flex gap-4">
                    <button
                      onClick={() => setLessonFormTab('content')}
                      className="flex-1 bg-[#0d9488] text-white py-2 rounded-lg hover:bg-[#0a7a70] transition-colors font-['DM_Sans',sans-serif] font-semibold"
                    >
                      Back to Content
                    </button>
                    <button
                      onClick={() => {
                        setShowLessonForm(false);
                        setEditingLesson(null);
                        setLessonForm({
                          title: '',
                          content: '',
                          duration: '',
                          type: 'text'
                        });
                        setUploadedFiles([]);
                      }}
                      className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors font-['DM_Sans',sans-serif] font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

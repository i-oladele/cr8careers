import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import coursesData, { Course, Module, Lesson } from '../data/courseContent';
import { progressTracker } from '../utils/progressTracking';

// Types
interface CourseFormData {
  title: string;
  description: string;
  duration: string;
  level: string;
  price: string;
  category: string;
  instructor: string;
}

interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string;
  salary: string;
  postedDate: string;
  isActive: boolean;
}

interface UploadedFile {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadDate: string;
}

// Sidebar Component
function Sidebar({ activeSection, setActiveSection }: { 
  activeSection: string; 
  setActiveSection: (section: string) => void;
}) {
  const menuItems = [
    { id: 'courses', label: 'Courses', icon: '📚' },
    { id: 'jobs', label: 'Job Openings', icon: '💼' },
  ];

  return (
    <div className="w-64 bg-white shadow-lg fixed left-0 top-20 bottom-0">
      <div className="p-6">
        <h3 className="font-['DM_Sans',sans-serif] font-bold text-lg text-gray-900 mb-4">
          Admin Menu
        </h3>
      </div>
      
      <nav className="px-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeSection === item.id
                ? 'bg-[#ed2a10] text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-['DM_Sans',sans-serif] font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="absolute bottom-6 left-6 right-6">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-['DM_Sans',sans-serif] font-medium">Back to Site</span>
        </Link>
      </div>
    </div>
  );
}

// Course Creation Wizard Component
function CourseCreationWizard({ 
  onClose, 
  onSave 
}: { 
  onClose: () => void; 
  onSave: (course: Course) => void;
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [courseData, setCourseData] = useState<CourseFormData>({
    title: '',
    description: '',
    duration: '',
    level: 'Beginner',
    price: '',
    category: 'Leadership',
    instructor: ''
  });
  const [modules, setModules] = useState<Module[]>([]);
  const [currentModule, setCurrentModule] = useState<Module>({
    id: '',
    title: '',
    description: '',
    lessons: []
  });
  const [currentLesson, setCurrentLesson] = useState<Lesson>({
    id: '',
    title: '',
    content: '',
    duration: '',
    type: 'text'
  });
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const totalSteps = 4;

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

  const addModule = () => {
    const newModule: Module = {
      id: 'mod-' + Date.now(),
      title: `Module ${modules.length + 1}`,
      description: '',
      lessons: []
    };
    setModules([...modules, newModule]);
    setCurrentModule(newModule);
  };

  const addLesson = () => {
    const newLesson: Lesson = {
      id: 'lesson-' + Date.now(),
      title: `Lesson ${currentModule.lessons.length + 1}`,
      content: '',
      duration: '',
      type: 'text'
    };
    const updatedModule = {
      ...currentModule,
      lessons: [...currentModule.lessons, newLesson]
    };
    setCurrentModule(updatedModule);
    setModules(modules.map(m => m.id === currentModule.id ? updatedModule : m));
    setCurrentLesson(newLesson);
  };

  const saveCourse = () => {
    const newCourse: Course = {
      id: 'course-' + Date.now(),
      ...courseData,
      modules: modules,
      finalAssessment: {
        questions: [],
        passingScore: 70
      }
    };
    onSave(newCourse);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="font-['DM_Sans',sans-serif] font-bold text-xl text-gray-900">
              Create New Course
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-between mt-4">
            {['Basic Info', 'Modules', 'Content', 'Review'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep > index + 1
                    ? 'bg-green-500 text-white'
                    : currentStep === index + 1
                    ? 'bg-[#ed2a10] text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > index + 1 ? '✓' : index + 1}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep === index + 1 ? 'text-[#ed2a10]' : 'text-gray-600'
                }`}>
                  {step}
                </span>
                {index < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="font-['DM_Sans',sans-serif] font-semibold text-lg mb-4">
                Course Information
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-['DM_Sans',sans-serif] font-medium text-gray-700 mb-2">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={courseData.title}
                    onChange={(e) => setCourseData({...courseData, title: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 font-['DM_Sans',sans-serif]"
                    placeholder="e.g., Leadership Excellence"
                  />
                </div>
                
                <div>
                  <label className="block font-['DM_Sans',sans-serif] font-medium text-gray-700 mb-2">
                    Instructor *
                  </label>
                  <input
                    type="text"
                    required
                    value={courseData.instructor}
                    onChange={(e) => setCourseData({...courseData, instructor: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 font-['DM_Sans',sans-serif]"
                    placeholder="e.g., Dr. Sarah Johnson"
                  />
                </div>
              </div>

              <div>
                <label className="block font-['DM_Sans',sans-serif] font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  value={courseData.description}
                  onChange={(e) => setCourseData({...courseData, description: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 font-['DM_Sans',sans-serif]"
                  rows={3}
                  placeholder="Provide a comprehensive description of the course..."
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-['DM_Sans',sans-serif] font-medium text-gray-700 mb-2">
                    Duration *
                  </label>
                  <input
                    type="text"
                    required
                    value={courseData.duration}
                    onChange={(e) => setCourseData({...courseData, duration: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 font-['DM_Sans',sans-serif]"
                    placeholder="e.g., 6 weeks"
                  />
                </div>
                
                <div>
                  <label className="block font-['DM_Sans',sans-serif] font-medium text-gray-700 mb-2">
                    Level *
                  </label>
                  <select
                    value={courseData.level}
                    onChange={(e) => setCourseData({...courseData, level: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 font-['DM_Sans',sans-serif]"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                
                <div>
                  <label className="block font-['DM_Sans',sans-serif] font-medium text-gray-700 mb-2">
                    Price *
                  </label>
                  <input
                    type="text"
                    required
                    value={courseData.price}
                    onChange={(e) => setCourseData({...courseData, price: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 font-['DM_Sans',sans-serif]"
                    placeholder="e.g., ₦75,000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-['DM_Sans',sans-serif] font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={courseData.category}
                    onChange={(e) => setCourseData({...courseData, category: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 font-['DM_Sans',sans-serif]"
                  >
                    <option value="Leadership">Leadership</option>
                    <option value="Technical">Technical</option>
                    <option value="Soft Skills">Soft Skills</option>
                    <option value="Career">Career</option>
                    <option value="Core Hospitality">Core Hospitality</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Modules */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-['DM_Sans',sans-serif] font-semibold text-lg">
                  Course Modules
                </h3>
                <button
                  onClick={addModule}
                  className="bg-[#ed2a10] text-white px-4 py-2 rounded-lg hover:bg-[#d42610] transition-colors font-['DM_Sans',sans-serif] font-medium"
                >
                  Add Module
                </button>
              </div>

              {modules.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📚</span>
                  </div>
                  <p className="font-['DM_Sans',sans-serif] text-gray-600 mb-4">
                    No modules yet. Add your first module to get started.
                  </p>
                  <button
                    onClick={addModule}
                    className="bg-[#0d9488] text-white px-6 py-2 rounded-lg hover:bg-[#0a7a70] transition-colors font-['DM_Sans',sans-serif] font-medium"
                  >
                    Add First Module
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {modules.map((module, index) => (
                    <div key={module.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-['DM_Sans',sans-serif] font-medium text-gray-900">
                          Module {index + 1}
                        </h4>
                        <button
                          onClick={() => setCurrentModule(module)}
                          className="text-[#ed2a10] hover:text-[#d42610] font-['DM_Sans',sans-serif] font-medium text-sm"
                        >
                          Edit
                        </button>
                      </div>
                      <input
                        type="text"
                        value={module.title}
                        onChange={(e) => {
                          const updatedModule = { ...module, title: e.target.value };
                          setModules(modules.map(m => m.id === module.id ? updatedModule : m));
                          if (currentModule.id === module.id) {
                            setCurrentModule(updatedModule);
                          }
                        }}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 font-['DM_Sans',sans-serif] mb-2"
                        placeholder="Module title"
                      />
                      <textarea
                        value={module.description}
                        onChange={(e) => {
                          const updatedModule = { ...module, description: e.target.value };
                          setModules(modules.map(m => m.id === module.id ? updatedModule : m));
                          if (currentModule.id === module.id) {
                            setCurrentModule(updatedModule);
                          }
                        }}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 font-['DM_Sans',sans-serif]"
                        rows={2}
                        placeholder="Module description"
                      />
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-sm text-gray-600 font-['DM_Sans',sans-serif]">
                          {module.lessons.length} lessons
                        </span>
                        <button
                          onClick={() => {
                            setCurrentModule(module);
                            addLesson();
                          }}
                          className="text-[#0d9488] hover:text-[#0a7a70] font-['DM_Sans',sans-serif] font-medium text-sm"
                        >
                          Add Lesson
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Content */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="font-['DM_Sans',sans-serif] font-semibold text-lg mb-4">
                Lesson Content
              </h3>
              
              {modules.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="font-['DM_Sans',sans-serif] text-gray-600">
                    Please add modules first before adding content.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {modules.map((module, moduleIndex) => (
                    <div key={module.id} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-['DM_Sans',sans-serif] font-medium text-gray-900 mb-3">
                        {module.title}
                      </h4>
                      
                      {module.lessons.length === 0 ? (
                        <div className="text-center py-6 bg-gray-50 rounded">
                          <p className="font-['DM_Sans',sans-serif] text-gray-600 text-sm mb-3">
                            No lessons in this module
                          </p>
                          <button
                            onClick={() => {
                              setCurrentModule(module);
                              addLesson();
                            }}
                            className="bg-[#0d9488] text-white px-4 py-2 rounded-lg hover:bg-[#0a7a70] transition-colors font-['DM_Sans',sans-serif] font-medium text-sm"
                          >
                            Add First Lesson
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {module.lessons.map((lesson, lessonIndex) => (
                            <div key={lesson.id} className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-['DM_Sans',sans-serif] font-medium text-gray-900">
                                  Lesson {lessonIndex + 1}
                                </h5>
                                <select
                                  value={lesson.type}
                                  onChange={(e) => {
                                    const updatedLesson = { ...lesson, type: e.target.value as any };
                                    const updatedModule = {
                                      ...module,
                                      lessons: module.lessons.map(l => l.id === lesson.id ? updatedLesson : l)
                                    };
                                    setModules(modules.map(m => m.id === module.id ? updatedModule : m));
                                  }}
                                  className="text-sm border border-gray-300 rounded px-2 py-1 font-['DM_Sans',sans-serif]"
                                >
                                  <option value="text">Text</option>
                                  <option value="video">Video</option>
                                  <option value="quiz">Quiz</option>
                                  <option value="assignment">Assignment</option>
                                </select>
                              </div>
                              
                              <input
                                type="text"
                                value={lesson.title}
                                onChange={(e) => {
                                  const updatedLesson = { ...lesson, title: e.target.value };
                                  const updatedModule = {
                                    ...module,
                                    lessons: module.lessons.map(l => l.id === lesson.id ? updatedLesson : l)
                                  };
                                  setModules(modules.map(m => m.id === module.id ? updatedModule : m));
                                }}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 font-['DM_Sans',sans-serif] mb-2"
                                placeholder="Lesson title"
                              />
                              
                              <input
                                type="text"
                                value={lesson.duration}
                                onChange={(e) => {
                                  const updatedLesson = { ...lesson, duration: e.target.value };
                                  const updatedModule = {
                                    ...module,
                                    lessons: module.lessons.map(l => l.id === lesson.id ? updatedLesson : l)
                                  };
                                  setModules(modules.map(m => m.id === module.id ? updatedModule : m));
                                }}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 font-['DM_Sans',sans-serif] mb-2"
                                placeholder="Duration (e.g., 15 min)"
                              />
                              
                              <textarea
                                value={lesson.content}
                                onChange={(e) => {
                                  const updatedLesson = { ...lesson, content: e.target.value };
                                  const updatedModule = {
                                    ...module,
                                    lessons: module.lessons.map(l => l.id === lesson.id ? updatedLesson : l)
                                  };
                                  setModules(modules.map(m => m.id === module.id ? updatedModule : m));
                                }}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 font-['DM_Sans',sans-serif]"
                                rows={3}
                                placeholder="Lesson content (supports markdown)"
                              />
                            </div>
                          ))}
                          
                          <button
                            onClick={() => {
                              setCurrentModule(module);
                              addLesson();
                            }}
                            className="w-full border-2 border-dashed border-gray-300 rounded-lg py-3 text-gray-600 hover:border-[#ed2a10] hover:text-[#ed2a10] transition-colors font-['DM_Sans',sans-serif] font-medium"
                          >
                            + Add Another Lesson
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="font-['DM_Sans',sans-serif] font-semibold text-lg mb-4">
                Review Course
              </h3>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="mb-6">
                  <h4 className="font-['DM_Sans',sans-serif] font-bold text-xl text-gray-900 mb-2">
                    {courseData.title || 'Untitled Course'}
                  </h4>
                  <p className="font-['DM_Sans',sans-serif] text-gray-600 mb-4">
                    {courseData.description || 'No description provided'}
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-['DM_Sans',sans-serif] font-medium text-gray-700">Instructor:</span>
                      <p className="font-['DM_Sans',sans-serif] text-gray-900">{courseData.instructor || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="font-['DM_Sans',sans-serif] font-medium text-gray-700">Duration:</span>
                      <p className="font-['DM_Sans',sans-serif] text-gray-900">{courseData.duration || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="font-['DM_Sans',sans-serif] font-medium text-gray-700">Level:</span>
                      <p className="font-['DM_Sans',sans-serif] text-gray-900">{courseData.level}</p>
                    </div>
                    <div>
                      <span className="font-['DM_Sans',sans-serif] font-medium text-gray-700">Price:</span>
                      <p className="font-['DM_Sans',sans-serif] text-gray-900">{courseData.price || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-['DM_Sans',sans-serif] font-medium text-gray-900 mb-3">
                    Course Structure
                  </h5>
                  {modules.length === 0 ? (
                    <p className="font-['DM_Sans',sans-serif] text-gray-600">No modules added</p>
                  ) : (
                    <div className="space-y-2">
                      {modules.map((module, index) => (
                        <div key={module.id} className="bg-white rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-['DM_Sans',sans-serif] font-medium text-gray-900">
                                Module {index + 1}: {module.title}
                              </span>
                              <p className="font-['DM_Sans',sans-serif] text-sm text-gray-600">
                                {module.lessons.length} lessons
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-4 py-2 rounded-lg font-['DM_Sans',sans-serif] font-medium ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Previous
            </button>
            
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-['DM_Sans',sans-serif] font-medium"
              >
                Cancel
              </button>
              
              {currentStep === totalSteps ? (
                <button
                  onClick={saveCourse}
                  disabled={!courseData.title || modules.length === 0}
                  className={`px-6 py-2 rounded-lg font-['DM_Sans',sans-serif] font-medium ${
                    !courseData.title || modules.length === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-[#ed2a10] text-white hover:bg-[#d42610]'
                  }`}
                >
                  Create Course
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  disabled={currentStep === 2 && modules.length === 0}
                  className={`px-6 py-2 rounded-lg font-['DM_Sans',sans-serif] font-medium ${
                    currentStep === 2 && modules.length === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-[#0d9488] text-white hover:bg-[#0a7a70]'
                  }`}
                >
                  Next Step
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Job Form Component
function JobForm({ 
  onClose, 
  onSave, 
  editingJob 
}: { 
  onClose: () => void; 
  onSave: (job: JobOpening) => void;
  editingJob: JobOpening | null;
}) {
  const [formData, setFormData] = useState<Partial<JobOpening>>(editingJob || {
    title: '',
    department: '',
    location: '',
    type: 'Full-time',
    description: '',
    requirements: '',
    salary: '',
    isActive: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const jobData: JobOpening = {
      id: editingJob?.id || 'job-' + Date.now(),
      title: formData.title || '',
      department: formData.department || '',
      location: formData.location || '',
      type: formData.type || 'Full-time',
      description: formData.description || '',
      requirements: formData.requirements || '',
      salary: formData.salary || '',
      postedDate: editingJob?.postedDate || new Date().toISOString().split('T')[0],
      isActive: formData.isActive !== false
    };
    
    onSave(jobData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="font-['DM_Sans',sans-serif] font-bold text-xl text-gray-900">
              {editingJob ? 'Edit Job Opening' : 'Post New Job'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-['DM_Sans',sans-serif] font-medium text-gray-700 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 font-['DM_Sans',sans-serif]"
                placeholder="e.g., Frontend Developer"
              />
            </div>
            
            <div>
              <label className="block font-['DM_Sans',sans-serif] font-medium text-gray-700 mb-2">
                Department *
              </label>
              <input
                type="text"
                required
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 font-['DM_Sans',sans-serif]"
                placeholder="e.g., Engineering"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-['DM_Sans',sans-serif] font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 font-['DM_Sans',sans-serif]"
                placeholder="e.g., Lagos, Nigeria"
              />
            </div>
            
            <div>
              <label className="block font-['DM_Sans',sans-serif] font-medium text-gray-700 mb-2">
                Employment Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 font-['DM_Sans',sans-serif]"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-['DM_Sans',sans-serif] font-medium text-gray-700 mb-2">
              Salary Range *
            </label>
            <input
              type="text"
              required
              value={formData.salary}
              onChange={(e) => setFormData({...formData, salary: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 font-['DM_Sans',sans-serif]"
              placeholder="e.g., ₦150,000 - ₦250,000"
            />
          </div>

          <div>
            <label className="block font-['DM_Sans',sans-serif] font-medium text-gray-700 mb-2">
              Job Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 font-['DM_Sans',sans-serif]"
              rows={4}
              placeholder="Provide a detailed description of the role, responsibilities, and what you're looking for..."
            />
          </div>

          <div>
            <label className="block font-['DM_Sans',sans-serif] font-medium text-gray-700 mb-2">
              Requirements *
            </label>
            <textarea
              required
              value={formData.requirements}
              onChange={(e) => setFormData({...formData, requirements: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 font-['DM_Sans',sans-serif]"
              rows={4}
              placeholder="List the required qualifications, skills, and experience..."
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive !== false}
              onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
              className="w-4 h-4 text-[#ed2a10] border-gray-300 rounded focus:ring-[#ed2a10]"
            />
            <label htmlFor="isActive" className="ml-2 font-['DM_Sans',sans-serif] text-gray-700">
              Active (job posting is live and accepting applications)
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 font-['DM_Sans',sans-serif] font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#ed2a10] text-white py-2 rounded-lg hover:bg-[#d42610] font-['DM_Sans',sans-serif] font-medium"
            >
              {editingJob ? 'Update Job' : 'Post Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Job Openings Component
function JobOpenings() {
  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>([
    {
      id: '1',
      title: 'Frontend Developer',
      department: 'Engineering',
      location: 'Lagos, Nigeria',
      type: 'Full-time',
      description: 'We are looking for a skilled frontend developer...',
      requirements: '3+ years experience with React, TypeScript...',
      salary: '₦150,000 - ₦250,000',
      postedDate: '2024-01-15',
      isActive: true
    }
  ]);
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState<JobOpening | null>(null);

  const handleJobSave = (job: JobOpening) => {
    if (editingJob) {
      // Update existing job
      setJobOpenings(jobOpenings.map(j => j.id === job.id ? job : j));
    } else {
      // Add new job
      setJobOpenings([...jobOpenings, job]);
    }
    setShowJobForm(false);
    setEditingJob(null);
  };

  const handleEditJob = (job: JobOpening) => {
    setEditingJob(job);
    setShowJobForm(true);
  };

  const handleDeleteJob = (jobId: string) => {
    if (confirm('Are you sure you want to delete this job posting?')) {
      setJobOpenings(jobOpenings.filter(j => j.id !== jobId));
    }
  };

  const handleToggleStatus = (jobId: string) => {
    setJobOpenings(jobOpenings.map(job => 
      job.id === jobId ? { ...job, isActive: !job.isActive } : job
    ));
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-['DM_Sans',sans-serif] font-bold text-2xl text-gray-900">
            Job Openings
          </h2>
          <p className="font-['DM_Sans',sans-serif] text-gray-600">
            Manage job postings and applications
          </p>
        </div>
        <button
          onClick={() => setShowJobForm(true)}
          className="bg-[#ed2a10] text-white px-6 py-3 rounded-lg hover:bg-[#d42610] transition-colors font-['DM_Sans',sans-serif] font-semibold"
        >
          Post New Job
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        {jobOpenings.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💼</span>
            </div>
            <h3 className="font-['DM_Sans',sans-serif] font-semibold text-lg text-gray-900 mb-2">
              No job openings yet
            </h3>
            <p className="font-['DM_Sans',sans-serif] text-gray-600 mb-4">
              Create your first job posting to start attracting talent
            </p>
            <button
              onClick={() => setShowJobForm(true)}
              className="bg-[#0d9488] text-white px-6 py-2 rounded-lg hover:bg-[#0a7a70] transition-colors font-['DM_Sans',sans-serif] font-medium"
            >
              Post First Job
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left font-['DM_Sans',sans-serif] font-medium text-gray-900">Position</th>
                  <th className="px-6 py-3 text-left font-['DM_Sans',sans-serif] font-medium text-gray-900">Department</th>
                  <th className="px-6 py-3 text-left font-['DM_Sans',sans-serif] font-medium text-gray-900">Location</th>
                  <th className="px-6 py-3 text-left font-['DM_Sans',sans-serif] font-medium text-gray-900">Type</th>
                  <th className="px-6 py-3 text-left font-['DM_Sans',sans-serif] font-medium text-gray-900">Posted</th>
                  <th className="px-6 py-3 text-left font-['DM_Sans',sans-serif] font-medium text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left font-['DM_Sans',sans-serif] font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {jobOpenings.map((job) => (
                  <tr key={job.id}>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-['DM_Sans',sans-serif] font-medium text-gray-900">{job.title}</div>
                        <div className="font-['DM_Sans',sans-serif] text-sm text-gray-600">{job.salary}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-['DM_Sans',sans-serif] text-gray-900">{job.department}</td>
                    <td className="px-6 py-4 font-['DM_Sans',sans-serif] text-gray-900">{job.location}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-['DM_Sans',sans-serif] rounded-full bg-blue-100 text-blue-800">
                        {job.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-['DM_Sans',sans-serif] text-gray-900">{job.postedDate}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-['DM_Sans',sans-serif] rounded-full ${
                        job.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {job.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleEditJob(job)}
                          className="text-blue-600 hover:text-blue-800 font-['DM_Sans',sans-serif] text-sm"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleToggleStatus(job.id)}
                          className="text-yellow-600 hover:text-yellow-800 font-['DM_Sans',sans-serif] text-sm"
                        >
                          {job.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button 
                          onClick={() => handleDeleteJob(job.id)}
                          className="text-red-600 hover:text-red-800 font-['DM_Sans',sans-serif] text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Job Form Modal */}
      {showJobForm && (
        <JobForm
          onClose={() => {
            setShowJobForm(false);
            setEditingJob(null);
          }}
          onSave={handleJobSave}
          editingJob={editingJob}
        />
      )}
    </div>
  );
}

// Main Admin Dashboard Component
export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('courses');
  const [showCourseWizard, setShowCourseWizard] = useState(false);
  const [courses, setCourses] = useState<Course[]>(coursesData);
  const navigate = useNavigate();

  // Check if user is admin
  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (!isAdmin) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleCourseSave = (newCourse: Course) => {
    setCourses([...courses, newCourse]);
    setShowCourseWizard(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      {/* Main Content */}
      <div className="ml-64">
        {/* Top Header */}
        <header className="fixed top-0 left-0 right-0 bg-white z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center gap-8">
                <Link to="/" className="h-16 w-32">
                  <img alt="CR8Careers Logo" className="h-full w-full object-contain" src="/logo.png" />
                </Link>
                <h1 className="font-['DM_Sans',sans-serif] font-bold text-2xl text-gray-900">
                  Admin Dashboard
                </h1>
              </div>
              <nav className="hidden md:flex gap-8 items-center">
                <Link to="/" className="font-['DM_Sans',sans-serif] text-[#1d1d1d] text-sm hover:text-[#ed2a10] transition-colors">Home</Link>
                <Link to="/courses" className="font-['DM_Sans',sans-serif] text-[#1d1d1d] text-sm hover:text-[#ed2a10] transition-colors">Courses</Link>
                <Link to="/admin" className="font-['DM_Sans',sans-serif] text-[#ed2a10] text-sm font-bold">Admin</Link>
                <Link to="/contact" className="font-['DM_Sans',sans-serif] text-[#1d1d1d] text-sm hover:text-[#ed2a10] transition-colors">Contact</Link>
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
        <main className="pt-20">
          {activeSection === 'courses' && (
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div key={course.id} className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-['DM_Sans',sans-serif] font-bold text-lg text-gray-900">
                        {course.title}
                      </h3>
                      <span className="px-2 py-1 text-xs font-['DM_Sans',sans-serif] rounded-full bg-green-100 text-green-800">
                        Published
                      </span>
                    </div>
                    <p className="font-['DM_Sans',sans-serif] text-gray-600 mb-4">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>{course.duration}</span>
                      <span>{course.level}</span>
                      <span>{course.modules.length} modules</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="flex-1 bg-[#0d9488] text-white py-2 rounded-lg hover:bg-[#0a7a70] transition-colors font-['DM_Sans',sans-serif] font-medium">
                        Edit Course
                      </button>
                      <button className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'jobs' && <JobOpenings />}
        </main>
      </div>

      {/* Course Creation Wizard */}
      {showCourseWizard && (
        <CourseCreationWizard
          onClose={() => setShowCourseWizard(false)}
          onSave={handleCourseSave}
        />
      )}
    </div>
  );
}

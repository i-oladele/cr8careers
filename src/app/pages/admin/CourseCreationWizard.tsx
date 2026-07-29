import { useState, useRef, useEffect } from 'react';
import { X, GripVertical, ChevronDown, ChevronUp, Paperclip } from 'lucide-react';
import { Course, Module, Lesson } from '../../data/courseContent';
import { uploadLessonFile, uploadCourseThumbnail } from '../../../lib/courseService';
import { CourseFormData } from './types';
import { QuizBuilder } from './QuizBuilder';
import { RichTextEditor } from './RichTextEditor';
import { uid } from './ids';

export function CourseCreationWizard({ onClose, onSave, editingCourse }: {
  onClose: () => void;
  onSave: (course: Course) => Promise<string | null>;
  editingCourse?: Course | null;
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isFree, setIsFree] = useState(editingCourse?.price === 'Free');
  const [courseData, setCourseData] = useState<CourseFormData>({
    title: editingCourse?.title ?? '',
    description: editingCourse?.description ?? '',
    duration: editingCourse?.duration ?? '',
    level: editingCourse?.level ?? 'Beginner',
    price: editingCourse?.price === 'Free' ? '' : (editingCourse?.price ?? ''),
    category: editingCourse?.category ?? 'Leadership',
    instructor: editingCourse?.instructor ?? '',
    thumbnailUrl: editingCourse?.thumbnailUrl ?? '',
  });
  const [modules, setModules] = useState<Module[]>(editingCourse?.modules ?? []);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [lessonFiles, setLessonFiles] = useState<Record<string, File>>({});
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(editingCourse?.thumbnailUrl ?? null);
  const [thumbnailError, setThumbnailError] = useState<string | null>(null);
  const [draggingLessonId, setDraggingLessonId] = useState<string | null>(null);
  const [openModules, setOpenModules] = useState<Set<string>>(new Set());
  const dragLesson = useRef<{ moduleId: string; lessonId: string } | null>(null);

  const totalSteps = 3;

  const handleThumbnailChange = (file: File) => {
    setThumbnailError(null);
    if (file.size > 5 * 1024 * 1024) {
      setThumbnailError('File exceeds 5MB limit.');
      return;
    }
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      if (img.width > 1920 || img.height > 1080) {
        setThumbnailError(`Image must be at most 1920×1080px (yours is ${img.width}×${img.height}px).`);
        return;
      }
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    };
    img.src = url;
  };

  const addModule = () => {
    const newModule: Module = {
      id: uid('mod'),
      title: `Module ${modules.length + 1}`,
      description: '',
      lessons: []
    };
    setModules([...modules, newModule]);
    setSelectedModule(newModule);
  };

  const addLesson = (mod?: Module) => {
    const target = mod ?? selectedModule;
    if (!target) return;
    const newLesson: Lesson = {
      id: uid('lesson'),
      title: `Lesson ${target.lessons.length + 1}`,
      content: '',
      duration: '',
      type: 'text'
    };
    const updatedModule = { ...target, lessons: [...target.lessons, newLesson] };
    setSelectedModule(updatedModule);
    setModules(modules.map(m => m.id === target.id ? updatedModule : m));
  };

  const addQuiz = (mod?: Module) => {
    const target = mod ?? selectedModule;
    if (!target) return;
    const newLesson: Lesson = {
      id: uid('lesson'),
      title: `Quiz ${target.lessons.filter(l => l.type === 'quiz').length + 1}`,
      content: '',
      duration: '',
      type: 'quiz'
    };
    const updatedModule = { ...target, lessons: [...target.lessons, newLesson] };
    setSelectedModule(updatedModule);
    setModules(modules.map(m => m.id === target.id ? updatedModule : m));
  };

  // Keyboard-accessible alternative to drag-to-reorder lessons.
  const moveLesson = (moduleId: string, lessonId: string, direction: -1 | 1) => {
    setModules(prev => prev.map(m => {
      if (m.id !== moduleId) return m;
      const idx = m.lessons.findIndex(l => l.id === lessonId);
      const target = idx + direction;
      if (idx === -1 || target < 0 || target >= m.lessons.length) return m;
      const lessons = [...m.lessons];
      [lessons[idx], lessons[target]] = [lessons[target], lessons[idx]];
      return { ...m, lessons };
    }));
  };

  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [stepErrors, setStepErrors] = useState<string[]>([]);

  // Snapshot the initial state so we can detect unsaved edits before discarding the draft.
  const initialSnapshot = useRef(JSON.stringify({ courseData, modules, isFree }));
  const hasUnsavedChanges = () =>
    JSON.stringify({ courseData, modules, isFree }) !== initialSnapshot.current ||
    thumbnailFile !== null ||
    Object.keys(lessonFiles).length > 0;

  const handleClose = () => {
    if (hasUnsavedChanges() && !confirm('You have unsaved changes. Discard this course draft?')) return;
    onClose();
  };

  // Warn on full-page navigation / refresh / tab close while there are unsaved edits.
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges()) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  });

  const stripHtml = (html: string) =>
    html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
  const isValidYouTubeUrl = (url: string) => /(?:v=|youtu\.be\/)([^&\s]+)/.test(url);

  const validateBasicInfo = (): string[] => {
    const errors: string[] = [];
    if (!courseData.title.trim()) errors.push('Course title is required.');
    if (!courseData.instructor.trim()) errors.push('Instructor is required.');
    if (!courseData.description.trim()) errors.push('Description is required.');
    if (!courseData.duration.trim()) errors.push('Duration is required.');
    if (!isFree && !courseData.price.trim()) errors.push('Set a price, or toggle the course as Free.');
    return errors;
  };

  const validateContent = (): string[] => {
    const errors: string[] = [];
    if (modules.length === 0) {
      errors.push('Add at least one module.');
      return errors;
    }
    modules.forEach((module, mi) => {
      const mLabel = `Module ${mi + 1}`;
      if (!module.title.trim()) errors.push(`${mLabel}: title is required.`);
      if (module.lessons.length === 0) {
        errors.push(`${mLabel}: add at least one lesson or quiz.`);
        return;
      }
      module.lessons.forEach((lesson, li) => {
        const isQuiz = lesson.type === 'quiz';
        const lLabel = `${mLabel}, ${isQuiz ? 'Quiz' : 'Lesson'} ${li + 1}`;
        if (!lesson.title.trim()) errors.push(`${lLabel}: title is required.`);
        if (isQuiz) {
          const questions = lesson.quizQuestions ?? [];
          if (questions.length === 0) {
            errors.push(`${lLabel}: add at least one question.`);
            return;
          }
          questions.forEach((q, qi) => {
            const qLabel = `${lLabel}, Q${qi + 1}`;
            if (!q.question.trim()) errors.push(`${qLabel}: question text is required.`);
            if (q.options.filter(o => o.text.trim()).length < 2) {
              errors.push(`${qLabel}: add at least two answer options.`);
            }
            const hasValidCorrect = (q.correctAnswers ?? []).some(id => q.options.find(o => o.id === id)?.text.trim());
            if (!hasValidCorrect) errors.push(`${qLabel}: mark a correct answer.`);
          });
        } else if (lesson.type === 'video') {
          if (!lesson.videoUrl?.trim()) errors.push(`${lLabel}: a YouTube URL is required.`);
          else if (!isValidYouTubeUrl(lesson.videoUrl)) errors.push(`${lLabel}: enter a valid YouTube URL.`);
        } else if (!stripHtml(lesson.content)) {
          errors.push(`${lLabel}: lesson content is empty.`);
        }
      });
    });
    return errors;
  };

  const handleSaveCourse = async () => {
    setSaveError(null);
    const basicErrors = validateBasicInfo();
    const contentErrors = validateContent();
    if (basicErrors.length || contentErrors.length) {
      setStepErrors([...basicErrors, ...contentErrors]);
      setCurrentStep(basicErrors.length ? 1 : 2);
      return;
    }
    setStepErrors([]);
    setIsSaving(true);
    const courseId = editingCourse?.id ?? uid('course');

    // Thumbnail: compress client-side to a JPEG blob, then upload to Storage and keep the URL.
    let thumbnailUrl = courseData.thumbnailUrl ?? '';
    if (thumbnailFile) {
      try {
        const blob = await new Promise<Blob>((resolve, reject) => {
          const img = new Image();
          const objectUrl = URL.createObjectURL(thumbnailFile);
          img.onload = () => {
            URL.revokeObjectURL(objectUrl);
            const canvas = document.createElement('canvas');
            const maxW = 640;
            const maxH = 360;
            let w = img.width;
            let h = img.height;
            if (w > maxW) { h = Math.round(h * maxW / w); w = maxW; }
            if (h > maxH) { w = Math.round(w * maxH / h); h = maxH; }
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            if (!ctx) { reject(new Error('Canvas not supported.')); return; }
            ctx.drawImage(img, 0, 0, w, h);
            canvas.toBlob(
              b => b ? resolve(b) : reject(new Error('Could not process the image.')),
              'image/jpeg',
              0.7
            );
          };
          img.onerror = () => reject(new Error('Could not read the image file.'));
          img.src = objectUrl;
        });
        const { url, error } = await uploadCourseThumbnail(courseId, blob);
        if (error || !url) throw new Error(error ?? 'Could not upload the thumbnail.');
        thumbnailUrl = url;
      } catch (e: unknown) {
        setSaveError(e instanceof Error ? e.message : 'Failed to process thumbnail.');
        setIsSaving(false);
        return;
      }
    }

    // Upload any newly attached lesson files to Supabase Storage and record their URLs.
    let modulesToSave = modules;
    const pendingLessonIds = Object.keys(lessonFiles);
    if (pendingLessonIds.length > 0) {
      try {
        const uploaded: Record<string, { name: string; url: string; path: string }> = {};
        for (const lessonId of pendingLessonIds) {
          const file = lessonFiles[lessonId];
          const { url, path, error } = await uploadLessonFile(courseId, lessonId, file);
          if (error || !url || !path) throw new Error(error ?? 'Could not upload the attached file.');
          uploaded[lessonId] = { name: file.name, url, path };
        }
        modulesToSave = modules.map(m => ({
          ...m,
          lessons: m.lessons.map(l => uploaded[l.id]
            ? { ...l, attachedFileName: uploaded[l.id].name, attachedFileUrl: uploaded[l.id].url, attachedFilePath: uploaded[l.id].path }
            : l),
        }));
      } catch (e: unknown) {
        setSaveError(e instanceof Error ? e.message : 'Failed to upload an attached file.');
        setIsSaving(false);
        return;
      }
    }

    const newCourse: Course = {
      id: courseId,
      ...courseData,
      thumbnailUrl,
      modules: modulesToSave,
      finalAssessment: editingCourse?.finalAssessment ?? {
        questions: [],
        passingScore: 70
      }
    };
    const error = await onSave(newCourse);
    setIsSaving(false);
    if (error) setSaveError(error);
  };

  const nextStep = () => {
    const errors = currentStep === 1 ? validateBasicInfo() : currentStep === 2 ? validateContent() : [];
    if (errors.length > 0) {
      setStepErrors(errors);
      return;
    }
    setStepErrors([]);
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setStepErrors([]);
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="font-['DM_Sans',sans-serif] font-bold text-xl text-gray-900 text-center">
          Create New Course
        </h2>
      </div>  
          {/* Progress Steps */}
          <div className="flex items-center justify-center mt-4 gap-0">
            {['Basic Info', 'Content', 'Review'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0 ${
                    currentStep > index + 1
                      ? 'bg-green-500 text-white'
                      : currentStep === index + 1
                      ? 'bg-[#ed2a10] text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {currentStep > index + 1 ? '✓' : index + 1}
                  </div>
                  <span className={`text-sm font-medium font-['DM_Sans',sans-serif] ${
                    currentStep === index + 1 ? 'text-[#ed2a10]' : 'text-gray-600'
                  }`}>
                    {step}
                  </span>
                </div>
                {index < 2 && (
                  <div className={`w-12 h-0.5 mx-3 ${
                    currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
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

              {/* Thumbnail + Duration/Level side by side — same 2-col grid as other rows */}
              <div className="grid grid-cols-2 gap-4 items-start">
                {/* Thumbnail */}
                <div>
                  <label className="block font-['DM_Sans',sans-serif] font-medium text-gray-700 mb-1">
                    Course Thumbnail
                  </label>
                  <p className="text-xs text-gray-400 font-['DM_Sans',sans-serif] mb-2">
                    Max 5MB · 1920×1080px
                  </p>
                  {thumbnailPreview ? (
                    <div className="relative w-full h-36 rounded-lg overflow-hidden border border-gray-200">
                      <img src={thumbnailPreview} alt="Thumbnail preview" className="w-full h-full object-cover" />
                      <button
                        onClick={() => { setThumbnailFile(null); setThumbnailPreview(null); setCourseData({...courseData, thumbnailUrl: ''}); }}
                        className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition-colors"
                        title="Remove thumbnail"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#ed2a10] hover:bg-red-50 transition-colors">
                      <div className="flex flex-col items-center gap-1 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs font-['DM_Sans',sans-serif] text-center">Click to upload</span>
                      </div>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleThumbnailChange(f); }} />
                    </label>
                  )}
                  {thumbnailError && <p className="text-red-500 text-xs mt-1 font-['DM_Sans',sans-serif]">{thumbnailError}</p>}
                </div>

                {/* Duration + Level stacked on the right */}
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block font-['DM_Sans',sans-serif] font-medium text-gray-700 mb-1">
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
                    <label className="block font-['DM_Sans',sans-serif] font-medium text-gray-700 mb-1">
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
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-['DM_Sans',sans-serif] font-medium text-gray-700">
                      Price {!isFree && '*'}
                    </label>
                    <div className="flex items-center gap-2 select-none">
                      <span id="free-toggle-label" className="font-['DM_Sans',sans-serif] text-sm text-gray-600">Free</span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={isFree}
                        aria-labelledby="free-toggle-label"
                        onClick={() => {
                          setIsFree(!isFree);
                          if (!isFree) setCourseData({...courseData, price: 'Free'});
                          else setCourseData({...courseData, price: ''});
                        }}
                        className={`relative w-10 h-6 rounded-full transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#ed2a10] focus:ring-offset-1 ${isFree ? 'bg-green-500' : 'bg-gray-300'}`}
                      >
                        <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${isFree ? 'translate-x-4' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  </div>
                  <div className={`flex items-center border rounded-lg overflow-hidden transition-colors ${isFree ? 'border-gray-200 bg-gray-100' : 'border-gray-300 bg-white'}`}>
                    <span className={`px-3 py-2 font-['DM_Sans',sans-serif] font-medium border-r select-none ${isFree ? 'border-gray-200 text-gray-400 bg-gray-100' : 'border-gray-300 text-gray-500 bg-gray-50'}`}>₦</span>
                    <input
                      type="text"
                      required={!isFree}
                      disabled={isFree}
                      value={isFree ? 'Free' : courseData.price}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/[^\d,]/g, '');
                        setCourseData({...courseData, price: raw});
                      }}
                      className={`flex-1 px-3 py-2 font-['DM_Sans',sans-serif] focus:outline-none bg-transparent ${isFree ? 'text-gray-400 cursor-not-allowed' : 'text-gray-900'}`}
                      placeholder="75,000"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Content (Modules + Lessons) */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="mb-4">
                <h3 className="font-['DM_Sans',sans-serif] font-semibold text-lg">
                  Content
                </h3>
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
                <div className="space-y-4">
                  {modules.map((module, index) => (
                    <div key={module.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-['DM_Sans',sans-serif] font-medium text-gray-900">
                          Module {index + 1}
                        </h4>
                        <button
                          onClick={() => {
                            setModules(modules.filter(m => m.id !== module.id));
                            if (selectedModule?.id === module.id) setSelectedModule(null);
                          }}
                          className="text-red-500 hover:text-red-700 transition-colors p-1"
                          title="Delete module"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                          </svg>
                        </button>
                      </div>
                      <input
                        type="text"
                        value={module.title}
                        onChange={(e) => {
                          const updatedModule = { ...module, title: e.target.value };
                          setModules(modules.map(m => m.id === module.id ? updatedModule : m));
                          if (selectedModule?.id === module.id) setSelectedModule(updatedModule);
                        }}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 font-['DM_Sans',sans-serif] mb-2"
                        placeholder="Module title"
                      />
                      <textarea
                        value={module.description}
                        onChange={(e) => {
                          const updatedModule = { ...module, description: e.target.value };
                          setModules(modules.map(m => m.id === module.id ? updatedModule : m));
                          if (selectedModule?.id === module.id) setSelectedModule(updatedModule);
                        }}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 font-['DM_Sans',sans-serif] mb-3"
                        rows={2}
                        placeholder="Module description"
                      />

                      {/* Lessons */}
                      {module.lessons.length === 0 ? (
                        <div className="text-center py-6 bg-gray-50 rounded">
                          <p className="font-['DM_Sans',sans-serif] text-gray-600 text-sm mb-3">
                            No lessons in this module
                          </p>
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => { setSelectedModule(module); addLesson(module); }}
                              className="bg-[#0d9488] text-white px-4 py-2 rounded-lg hover:bg-[#0a7a70] transition-colors font-['DM_Sans',sans-serif] font-medium text-sm"
                            >
                              Add First Lesson
                            </button>
                            <button
                              onClick={() => { setSelectedModule(module); addQuiz(module); }}
                              className="bg-[#ed2a10] text-white px-4 py-2 rounded-lg hover:bg-[#d42610] transition-colors font-['DM_Sans',sans-serif] font-medium text-sm"
                            >
                              Add Quiz
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {module.lessons.map((lesson, lessonIndex) => (
                            <div
                              key={lesson.id}
                              draggable
                              onDragStart={() => {
                                dragLesson.current = { moduleId: module.id, lessonId: lesson.id };
                                setDraggingLessonId(lesson.id);
                              }}
                              onDragOver={(e) => {
                                e.preventDefault();
                                if (!dragLesson.current) return;
                                if (dragLesson.current.moduleId !== module.id) return;
                                if (dragLesson.current.lessonId === lesson.id) return;
                                const currentModule = modules.find(m => m.id === module.id)!;
                                const fromIdx = currentModule.lessons.findIndex(l => l.id === dragLesson.current!.lessonId);
                                const toIdx = currentModule.lessons.findIndex(l => l.id === lesson.id);
                                if (fromIdx === toIdx) return;
                                const reordered = [...currentModule.lessons];
                                reordered.splice(toIdx, 0, reordered.splice(fromIdx, 1)[0]);
                                setModules(modules.map(m => m.id === module.id ? { ...m, lessons: reordered } : m));
                              }}
                              onDragEnd={() => {
                                dragLesson.current = null;
                                setDraggingLessonId(null);
                              }}
                              className={`bg-gray-50 rounded-lg p-3 transition-opacity ${draggingLessonId === lesson.id ? 'opacity-40' : 'opacity-100'}`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-['DM_Sans',sans-serif] font-medium text-gray-900 flex items-center gap-2">
                                  <span className="flex items-center shrink-0">
                                    <GripVertical size={14} className="text-gray-400 cursor-grab" aria-hidden="true" />
                                    <button
                                      type="button"
                                      onClick={() => moveLesson(module.id, lesson.id, -1)}
                                      disabled={lessonIndex === 0}
                                      title="Move up"
                                      aria-label="Move lesson up"
                                      className="p-0.5 text-gray-400 hover:text-gray-700 transition-colors disabled:opacity-30 disabled:hover:text-gray-400"
                                    >
                                      <ChevronUp size={14} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => moveLesson(module.id, lesson.id, 1)}
                                      disabled={lessonIndex === module.lessons.length - 1}
                                      title="Move down"
                                      aria-label="Move lesson down"
                                      className="p-0.5 text-gray-400 hover:text-gray-700 transition-colors disabled:opacity-30 disabled:hover:text-gray-400"
                                    >
                                      <ChevronDown size={14} />
                                    </button>
                                  </span>
                                  {lesson.type === 'quiz' ? (
                                    <>
                                      Quiz {module.lessons.filter((l, i) => l.type === 'quiz' && i <= lessonIndex).length}
                                      <span className="text-xs bg-[#ed2a10] text-white px-1.5 py-0.5 rounded font-normal">Quiz</span>
                                    </>
                                  ) : (
                                    `Lesson ${module.lessons.filter((l, i) => l.type !== 'quiz' && i <= lessonIndex).length}`
                                  )}
                                </h5>
                                <div className="flex items-center gap-2">
                                  {lesson.type !== 'quiz' && (
                                  <select
                                    value={lesson.type}
                                    onChange={(e) => {
                                      const updatedLesson = { ...lesson, type: e.target.value as Lesson['type'] };
                                      const updatedModule = { ...module, lessons: module.lessons.map(l => l.id === lesson.id ? updatedLesson : l) };
                                      setModules(modules.map(m => m.id === module.id ? updatedModule : m));
                                    }}
                                    className="text-sm border border-gray-300 rounded px-2 py-1 font-['DM_Sans',sans-serif]"
                                  >
                                    <option value="text">Text</option>
                                    <option value="video">Video</option>
                                  </select>
                                  )}
                                  <button
                                    onClick={() => {
                                      const updatedModule = { ...module, lessons: module.lessons.filter(l => l.id !== lesson.id) };
                                      setModules(modules.map(m => m.id === module.id ? updatedModule : m));
                                    }}
                                    className="text-red-500 hover:text-red-700 transition-colors p-1"
                                    title="Delete lesson"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                                    </svg>
                                  </button>
                                </div>
                              </div>
                              <input
                                type="text"
                                value={lesson.title}
                                onChange={(e) => {
                                  const updatedLesson = { ...lesson, title: e.target.value };
                                  const updatedModule = { ...module, lessons: module.lessons.map(l => l.id === lesson.id ? updatedLesson : l) };
                                  setModules(modules.map(m => m.id === module.id ? updatedModule : m));
                                }}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 font-['DM_Sans',sans-serif] mb-2"
                                placeholder="Lesson title"
                              />
                              {lesson.type === 'quiz' ? (
                                <QuizBuilder
                                  questions={lesson.quizQuestions || []}
                                  onChange={(qs) => {
                                    const updatedLesson = { ...lesson, quizQuestions: qs };
                                    const updatedModule = { ...module, lessons: module.lessons.map(l => l.id === lesson.id ? updatedLesson : l) };
                                    setModules(modules.map(m => m.id === module.id ? updatedModule : m));
                                  }}
                                />
                              ) : lesson.type === 'video' ? (
                                <div className="space-y-2">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">YouTube URL</label>
                                    <input
                                      type="url"
                                      value={lesson.videoUrl || ''}
                                      onChange={(e) => {
                                        const updatedLesson = { ...lesson, videoUrl: e.target.value };
                                        const updatedModule = { ...module, lessons: module.lessons.map(l => l.id === lesson.id ? updatedLesson : l) };
                                        setModules(modules.map(m => m.id === module.id ? updatedModule : m));
                                      }}
                                      className="w-full border border-gray-300 rounded-lg px-3 py-2 font-['DM_Sans',sans-serif] text-sm"
                                      placeholder="https://www.youtube.com/watch?v=..."
                                    />
                                    {lesson.videoUrl && (() => {
                                      const match = lesson.videoUrl.match(/(?:v=|youtu\.be\/)([^&\s]+)/);
                                      return match ? (
                                        <div className="mt-2 rounded-lg overflow-hidden aspect-video bg-black">
                                          <iframe
                                            src={`https://www.youtube.com/embed/${match[1]}`}
                                            className="w-full h-full"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                          />
                                        </div>
                                      ) : null;
                                    })()}
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Video Description</label>
                                    <textarea
                                      value={lesson.videoDescription || ''}
                                      onChange={(e) => {
                                        const updatedLesson = { ...lesson, videoDescription: e.target.value };
                                        const updatedModule = { ...module, lessons: module.lessons.map(l => l.id === lesson.id ? updatedLesson : l) };
                                        setModules(modules.map(m => m.id === module.id ? updatedModule : m));
                                      }}
                                      className="w-full border border-gray-300 rounded-lg px-3 py-2 font-['DM_Sans',sans-serif] text-sm"
                                      rows={3}
                                      placeholder="Describe what learners will get from this video..."
                                    />
                                  </div>
                                </div>
                              ) : (
                                <RichTextEditor
                                  value={lesson.content}
                                  onChange={(html) => {
                                    const updatedLesson = { ...lesson, content: html };
                                    const updatedModule = { ...module, lessons: module.lessons.map(l => l.id === lesson.id ? updatedLesson : l) };
                                    setModules(modules.map(m => m.id === module.id ? updatedModule : m));
                                  }}
                                />
                              )}

                              {/* File attachment */}
                              <div className="mt-2">
                                {lessonFiles[lesson.id] || lesson.attachedFileName ? (
                                  <div className="flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 text-sm">
                                    <Paperclip size={14} className="text-gray-500 shrink-0" />
                                    <span className="flex-1 truncate text-gray-700 font-['DM_Sans',sans-serif]">
                                      {lessonFiles[lesson.id]?.name || lesson.attachedFileName}
                                    </span>
                                    <button
                                      onClick={() => {
                                        const updatedLesson: Lesson = { ...lesson, attachedFileName: undefined, attachedFileUrl: undefined, attachedFilePath: undefined };
                                        const updatedModule = { ...module, lessons: module.lessons.map(l => l.id === lesson.id ? updatedLesson : l) };
                                        setModules(modules.map(m => m.id === module.id ? updatedModule : m));
                                        setLessonFiles(prev => { const next = { ...prev }; delete next[lesson.id]; return next; });
                                      }}
                                      className="text-gray-400 hover:text-red-500 transition-colors shrink-0"
                                      title="Remove file"
                                    >
                                      <X size={14} />
                                    </button>
                                  </div>
                                ) : (
                                  <label className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 cursor-pointer w-fit font-['DM_Sans',sans-serif] transition-colors">
                                    <Paperclip size={14} />
                                    <span>Attach a file</span>
                                    <input
                                      type="file"
                                      className="hidden"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        setLessonFiles(prev => ({ ...prev, [lesson.id]: file }));
                                        const updatedLesson = { ...lesson, attachedFileName: file.name };
                                        const updatedModule = { ...module, lessons: module.lessons.map(l => l.id === lesson.id ? updatedLesson : l) };
                                        setModules(modules.map(m => m.id === module.id ? updatedModule : m));
                                      }}
                                    />
                                  </label>
                                )}
                              </div>
                            </div>
                          ))}
                          <div className="flex gap-2">
                            <button
                              onClick={() => { setSelectedModule(module); addLesson(module); }}
                              className="flex-1 border-2 border-dashed border-gray-300 rounded-lg py-3 text-gray-600 hover:border-[#0d9488] hover:text-[#0d9488] transition-colors font-['DM_Sans',sans-serif] font-medium"
                            >
                              + Add Lesson
                            </button>
                            <button
                              onClick={() => { setSelectedModule(module); addQuiz(module); }}
                              className="flex-1 border-2 border-dashed border-gray-300 rounded-lg py-3 text-gray-600 hover:border-[#ed2a10] hover:text-[#ed2a10] transition-colors font-['DM_Sans',sans-serif] font-medium"
                            >
                              + Add Quiz
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addModule}
                    className="w-full border-2 border-dashed border-gray-300 rounded-lg py-3 text-gray-600 hover:border-[#ed2a10] hover:text-[#ed2a10] transition-colors font-['DM_Sans',sans-serif] font-medium"
                  >
                    + Add Module
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Review */}
          {currentStep === 3 && (
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
                      <p className="font-['DM_Sans',sans-serif] text-gray-900">{courseData.price ? (courseData.price === 'Free' ? 'Free' : `₦${courseData.price}`) : 'Not specified'}</p>
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
                      {modules.map((module, index) => {
                        const isOpen = openModules.has(module.id);
                        const lessonCount = module.lessons.filter(l => l.type !== 'quiz').length;
                        const quizCount = module.lessons.filter(l => l.type === 'quiz').length;
                        return (
                          <div key={module.id} className="bg-white rounded-lg overflow-hidden border border-gray-100">
                            <button
                              onClick={() => setOpenModules(prev => {
                                const next = new Set(prev);
                                if (isOpen) next.delete(module.id);
                                else next.add(module.id);
                                return next;
                              })}
                              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                            >
                              <div>
                                <span className="font-['DM_Sans',sans-serif] font-medium text-gray-900">
                                  Module {index + 1}: {module.title || 'Untitled Module'}
                                </span>
                                <p className="font-['DM_Sans',sans-serif] text-xs text-gray-500 mt-0.5">
                                  {lessonCount} lesson{lessonCount !== 1 ? 's' : ''}{quizCount > 0 ? `, ${quizCount} quiz${quizCount !== 1 ? 'zes' : ''}` : ''}
                                </p>
                              </div>
                              <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isOpen && (
                              <div className="border-t border-gray-100 divide-y divide-gray-50">
                                {module.lessons.length === 0 ? (
                                  <p className="px-4 py-3 text-sm text-gray-400 font-['DM_Sans',sans-serif]">No content added</p>
                                ) : (
                                  module.lessons.map((lesson, li) => (
                                    <div key={lesson.id} className="flex items-start gap-3 px-4 py-3">
                                      <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold ${lesson.type === 'quiz' ? 'bg-[#ed2a10]' : 'bg-[#0d9488]'}`}>
                                        {lesson.type === 'quiz' ? 'Q' : li + 1}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="font-['DM_Sans',sans-serif] text-sm font-medium text-gray-800 truncate">
                                          {lesson.title || (lesson.type === 'quiz' ? 'Untitled Quiz' : 'Untitled Lesson')}
                                        </p>
                                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                          <span className={`text-xs px-1.5 py-0.5 rounded font-['DM_Sans',sans-serif] ${lesson.type === 'quiz' ? 'bg-red-50 text-[#ed2a10]' : lesson.type === 'video' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                                            {lesson.type === 'quiz' ? 'Quiz' : lesson.type === 'video' ? 'Video' : 'Text'}
                                          </span>
                                          {lesson.type === 'quiz' && lesson.quizQuestions && (
                                            <span className="text-xs text-gray-400 font-['DM_Sans',sans-serif]">{lesson.quizQuestions.length} question{lesson.quizQuestions.length !== 1 ? 's' : ''}</span>
                                          )}
                                          {lesson.attachedFileName && (
                                            <span className="text-xs text-gray-400 font-['DM_Sans',sans-serif] flex items-center gap-0.5"><Paperclip size={10} />{lesson.attachedFileName}</span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {saveError && (
          <div className="mx-6 mb-0 mt-0 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm font-['DM_Sans',sans-serif]">
            <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{saveError}</span>
          </div>
        )}
        {stepErrors.length > 0 && (
          <div className="mx-6 mt-4 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm font-['DM_Sans',sans-serif]">
            <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <div>
              <p className="font-semibold mb-1">Please fix the following before continuing:</p>
              <ul className="list-disc pl-5 space-y-0.5">
                {stepErrors.map((err, i) => <li key={i}>{err}</li>)}
              </ul>
            </div>
          </div>
        )}
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
                onClick={handleClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-['DM_Sans',sans-serif] font-medium"
              >
                Cancel
              </button>

              {currentStep === totalSteps ? (
                <div className="flex flex-col items-end gap-1">
                  <button
                    onClick={handleSaveCourse}
                    disabled={isSaving}
                    className={`px-6 py-2 rounded-lg font-['DM_Sans',sans-serif] font-medium ${
                      isSaving
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-[#ed2a10] text-white hover:bg-[#d42610]'
                    }`}
                  >
                    {isSaving ? 'Saving...' : editingCourse ? 'Update Course' : 'Create Course'}
                  </button>
                </div>
              ) : (
                <button
                  onClick={nextStep}
                  className="px-6 py-2 rounded-lg font-['DM_Sans',sans-serif] font-medium bg-[#0d9488] text-white hover:bg-[#0a7a70]"
                >
                  Next Step
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Undo2, Redo2, Bold, Italic, Underline, Strikethrough,
  Heading1, Heading2, Heading3, Pilcrow,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, IndentIncrease, IndentDecrease,
  Quote, Code, Minus, Link2, Palette, Highlighter, Eraser, Paperclip, X, GripVertical, ChevronDown,
} from 'lucide-react';
import coursesData, { Course, Module, Lesson, QuizQuestion, QuizOption } from '../data/courseContent';
import { saveCourse, fetchCourses } from '../../lib/courseService';
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
    { id: 'courses', label: 'Courses', icon: '/Books.svg' },
    { id: 'jobs', label: 'Job Openings', icon: '/ReadCvLogo.svg' },
  ];

  return (
    <div className="w-64 bg-white shadow-lg fixed left-0 top-36 bottom-0">
      <div className="p-6">
        <h3 className="font-['DM_Sans',sans-serif] font-bold text-lg text-gray-900 mb-4">
          Admin Dashboard
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
            {item.icon.startsWith('/') ? (
              <img 
                src={item.icon} 
                alt={item.label}
                className={`w-5 h-5 ${activeSection === item.id ? 'filter brightness-0 invert' : ''}`}
              />
            ) : (
              <span className="text-xl">{item.icon}</span>
            )}
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

function QuizBuilder({ questions, onChange }: { questions: QuizQuestion[]; onChange: (qs: QuizQuestion[]) => void }) {
  const newQuestion = (): QuizQuestion => ({
    id: 'q-' + Date.now() + Math.random(),
    question: '',
    type: 'single',
    options: [
      { id: 'o-' + Date.now() + '0', text: '' },
      { id: 'o-' + Date.now() + '1', text: '' },
    ],
    correctAnswers: [],
  });

  const updateQuestion = (qId: string, patch: Partial<QuizQuestion>) => {
    onChange(questions.map(q => q.id === qId ? { ...q, ...patch } : q));
  };

  const addOption = (qId: string) => {
    onChange(questions.map(q => q.id === qId
      ? { ...q, options: [...q.options, { id: 'o-' + Date.now(), text: '' }] }
      : q
    ));
  };

  const updateOption = (qId: string, oId: string, text: string) => {
    onChange(questions.map(q => q.id === qId
      ? { ...q, options: q.options.map(o => o.id === oId ? { ...o, text } : o) }
      : q
    ));
  };

  const removeOption = (qId: string, oId: string) => {
    onChange(questions.map(q => q.id === qId
      ? { ...q, options: q.options.filter(o => o.id !== oId), correctAnswers: q.correctAnswers.filter(a => a !== oId) }
      : q
    ));
  };

  const toggleCorrect = (q: QuizQuestion, oId: string) => {
    let next: string[];
    if (q.type === 'single') {
      next = [oId];
    } else {
      next = q.correctAnswers.includes(oId)
        ? q.correctAnswers.filter(a => a !== oId)
        : [...q.correctAnswers, oId];
    }
    updateQuestion(q.id, { correctAnswers: next });
  };

  return (
    <div className="space-y-3">
      {questions.length === 0 && (
        <p className="text-sm text-gray-400 font-['DM_Sans',sans-serif] text-center py-3">No questions yet. Add your first question.</p>
      )}
      {questions.map((q, qi) => (
        <div key={q.id} className="border border-gray-200 rounded-lg p-3 bg-white space-y-3">
          {/* Question header */}
          <div className="flex items-start gap-2">
            <span className="text-xs font-semibold text-gray-500 mt-2.5 shrink-0 font-['DM_Sans',sans-serif]">Q{qi + 1}</span>
            <input
              type="text"
              value={q.question}
              onChange={(e) => updateQuestion(q.id, { question: e.target.value })}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm font-['DM_Sans',sans-serif] focus:outline-none focus:ring-1 focus:ring-gray-400"
              placeholder="Enter your question..."
            />
            <button onClick={() => onChange(questions.filter(x => x.id !== q.id))} className="text-red-500 hover:text-red-700 p-1 mt-1 shrink-0"><X size={15} /></button>
          </div>

          {/* Answer type toggle */}
          <div className="flex items-center gap-3 pl-6">
            <span className="text-xs text-gray-500 font-['DM_Sans',sans-serif]">Answer type:</span>
            <label className="flex items-center gap-1.5 cursor-pointer text-xs font-['DM_Sans',sans-serif]">
              <input
                type="radio"
                checked={q.type === 'single'}
                onChange={() => updateQuestion(q.id, { type: 'single', correctAnswers: [] })}
                className="accent-[#ed2a10]"
              />
              Single choice
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-xs font-['DM_Sans',sans-serif]">
              <input
                type="radio"
                checked={q.type === 'multi'}
                onChange={() => updateQuestion(q.id, { type: 'multi', correctAnswers: [] })}
                className="accent-[#ed2a10]"
              />
              Multiple choice
            </label>
          </div>

          {/* Options */}
          <div className="space-y-2 pl-6">
            <p className="text-xs text-gray-400 font-['DM_Sans',sans-serif]">
              {q.type === 'single' ? 'Select the correct answer' : 'Select all correct answers'}
            </p>
            {q.options.map((o, oi) => {
              const isCorrect = q.correctAnswers.includes(o.id);
              return (
                <div key={o.id} className="flex items-center gap-2">
                  {q.type === 'single' ? (
                    <input type="radio" checked={isCorrect} onChange={() => toggleCorrect(q, o.id)} className="accent-[#ed2a10] shrink-0" title="Mark as correct answer" />
                  ) : (
                    <input type="checkbox" checked={isCorrect} onChange={() => toggleCorrect(q, o.id)} className="accent-[#ed2a10] shrink-0" title="Mark as correct answer" />
                  )}
                  <input
                    type="text"
                    value={o.text}
                    onChange={(e) => updateOption(q.id, o.id, e.target.value)}
                    className={`flex-1 border rounded-lg px-3 py-1.5 text-sm font-['DM_Sans',sans-serif] focus:outline-none focus:ring-1 focus:ring-gray-400 ${isCorrect ? 'border-green-400 bg-green-50' : 'border-gray-300'}`}
                    placeholder={`Option ${oi + 1}`}
                  />
                  {q.options.length > 2 && (
                    <button onClick={() => removeOption(q.id, o.id)} className="text-gray-400 hover:text-red-500 shrink-0"><X size={13} /></button>
                  )}
                </div>
              );
            })}
            <button
              onClick={() => addOption(q.id)}
              className="text-xs text-gray-500 hover:text-gray-700 font-['DM_Sans',sans-serif] flex items-center gap-1 mt-1"
            >
              + Add option
            </button>
          </div>
        </div>
      ))}
      <button
        onClick={() => onChange([...questions, newQuestion()])}
        className="w-full border-2 border-dashed border-gray-300 rounded-lg py-2.5 text-sm text-gray-500 hover:border-[#ed2a10] hover:text-[#ed2a10] transition-colors font-['DM_Sans',sans-serif] font-medium"
      >
        + Add Question
      </button>
    </div>
  );
}

function RichTextEditor({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [floatingToolbar, setFloatingToolbar] = useState<{ top: number; left: number } | null>(null);
  const [isEmpty, setIsEmpty] = useState(!value);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const fontColorRef = useRef<HTMLInputElement>(null);
  const highlightRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value || '';
      setIsEmpty(!value);
    }
  }, []);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
      setIsEmpty(editorRef.current.innerText.trim() === '');
    }
  };

  const checkSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0 && editorRef.current) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const editorRect = editorRef.current.getBoundingClientRect();
      setFloatingToolbar({
        top: rect.top - editorRect.top - 46,
        left: Math.max(80, Math.min(rect.left - editorRect.left + rect.width / 2, editorRect.width - 80)),
      });
    } else {
      setFloatingToolbar(null);
    }
  };

  const exec = (command: string, val?: string) => {
    document.execCommand(command, false, val);
    editorRef.current?.focus();
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  const insertLink = () => {
    if (!linkUrl) return;
    const url = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`;
    exec('createLink', url);
    setLinkUrl('');
    setShowLinkInput(false);
  };

  const Sep = () => <div className="w-px h-5 bg-gray-300 mx-0.5 shrink-0" />;

  const Btn = ({ title, onClick, children }: { title: string; onClick: () => void; children: React.ReactNode }) => (
    <button
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      className="p-1.5 rounded hover:bg-gray-200 text-gray-700 transition-colors flex items-center justify-center shrink-0"
    >
      {children}
    </button>
  );

  return (
    <div className="border border-gray-300 rounded-lg font-['DM_Sans',sans-serif]">
      {/* Toolbar */}
      <div className="flex items-center flex-wrap gap-0.5 px-2 py-1.5 border-b border-gray-200 bg-gray-50 rounded-t-lg">

        {/* History */}
        <Btn title="Undo" onClick={() => exec('undo')}><Undo2 size={14} /></Btn>
        <Btn title="Redo" onClick={() => exec('redo')}><Redo2 size={14} /></Btn>
        <Sep />

        {/* Text style */}
        <Btn title="Bold" onClick={() => exec('bold')}><Bold size={14} /></Btn>
        <Btn title="Italic" onClick={() => exec('italic')}><Italic size={14} /></Btn>
        <Btn title="Underline" onClick={() => exec('underline')}><Underline size={14} /></Btn>
        <Btn title="Strikethrough" onClick={() => exec('strikeThrough')}><Strikethrough size={14} /></Btn>
        <Btn title="Subscript" onClick={() => exec('subscript')}><span className="text-xs font-medium leading-none">x<sub>2</sub></span></Btn>
        <Btn title="Superscript" onClick={() => exec('superscript')}><span className="text-xs font-medium leading-none">x<sup>2</sup></span></Btn>
        <Sep />

        {/* Font size */}
        <select
          onMouseDown={(e) => e.stopPropagation()}
          onChange={(e) => { exec('fontSize', e.target.value); (e.target as HTMLSelectElement).value = ''; }}
          defaultValue=""
          title="Font size"
          className="text-xs border border-gray-300 rounded px-1 py-1 bg-white text-gray-700 cursor-pointer h-7"
        >
          <option value="" disabled>Size</option>
          <option value="1">Small</option>
          <option value="3">Normal</option>
          <option value="4">Large</option>
          <option value="5">X-Large</option>
          <option value="6">XX-Large</option>
        </select>
        <Sep />

        {/* Headings */}
        <Btn title="Heading 1" onClick={() => exec('formatBlock', 'h1')}><Heading1 size={14} /></Btn>
        <Btn title="Heading 2" onClick={() => exec('formatBlock', 'h2')}><Heading2 size={14} /></Btn>
        <Btn title="Heading 3" onClick={() => exec('formatBlock', 'h3')}><Heading3 size={14} /></Btn>
        <Btn title="Paragraph" onClick={() => exec('formatBlock', 'p')}><Pilcrow size={14} /></Btn>
        <Sep />

        {/* Alignment */}
        <Btn title="Align left" onClick={() => exec('justifyLeft')}><AlignLeft size={14} /></Btn>
        <Btn title="Align center" onClick={() => exec('justifyCenter')}><AlignCenter size={14} /></Btn>
        <Btn title="Align right" onClick={() => exec('justifyRight')}><AlignRight size={14} /></Btn>
        <Btn title="Justify" onClick={() => exec('justifyFull')}><AlignJustify size={14} /></Btn>
        <Sep />

        {/* Lists & indent */}
        <Btn title="Bullet list" onClick={() => exec('insertUnorderedList')}><List size={14} /></Btn>
        <Btn title="Numbered list" onClick={() => exec('insertOrderedList')}><ListOrdered size={14} /></Btn>
        <Btn title="Indent" onClick={() => exec('indent')}><IndentIncrease size={14} /></Btn>
        <Btn title="Outdent" onClick={() => exec('outdent')}><IndentDecrease size={14} /></Btn>
        <Sep />

        {/* Blocks */}
        <Btn title="Blockquote" onClick={() => exec('formatBlock', 'blockquote')}><Quote size={14} /></Btn>
        <Btn title="Code block" onClick={() => exec('formatBlock', 'pre')}><Code size={14} /></Btn>
        <Btn title="Horizontal rule" onClick={() => exec('insertHorizontalRule')}><Minus size={14} /></Btn>
        <Sep />

        {/* Link */}
        <div className="relative">
          <Btn title="Insert link" onClick={() => setShowLinkInput(v => !v)}><Link2 size={14} /></Btn>
          {showLinkInput && (
            <div className="absolute top-9 left-0 z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-2 flex gap-2 items-center min-w-[230px]">
              <input
                autoFocus
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') insertLink(); if (e.key === 'Escape') setShowLinkInput(false); }}
                placeholder="https://..."
                className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
              <button onClick={insertLink} className="bg-[#ed2a10] text-white px-2 py-1 rounded text-sm hover:bg-[#d42610] shrink-0">Add</button>
            </div>
          )}
        </div>
        <Sep />

        {/* Color */}
        <label title="Font color" className="p-1.5 rounded hover:bg-gray-200 cursor-pointer flex items-center justify-center relative" onMouseDown={(e) => e.preventDefault()}>
          <Palette size={14} className="text-gray-700" />
          <input ref={fontColorRef} type="color" className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" onChange={(e) => exec('foreColor', e.target.value)} />
        </label>
        <label title="Highlight color" className="p-1.5 rounded hover:bg-gray-200 cursor-pointer flex items-center justify-center relative" onMouseDown={(e) => e.preventDefault()}>
          <Highlighter size={14} className="text-gray-700" />
          <input ref={highlightRef} type="color" className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" onChange={(e) => exec('hiliteColor', e.target.value)} />
        </label>
        <Sep />

        {/* Clear */}
        <Btn title="Clear formatting" onClick={() => exec('removeFormat')}><Eraser size={14} /></Btn>
      </div>

      {/* Editor area */}
      <div className="relative">
        {floatingToolbar && (
          <div
            style={{ top: floatingToolbar.top, left: floatingToolbar.left, transform: 'translateX(-50%)' }}
            className="absolute z-50 bg-gray-900 rounded-lg shadow-xl flex items-center gap-0.5 px-1.5 py-1"
          >
            {([
              { cmd: 'bold', icon: <Bold size={13} /> },
              { cmd: 'italic', icon: <Italic size={13} /> },
              { cmd: 'underline', icon: <Underline size={13} /> },
              { cmd: 'strikeThrough', icon: <Strikethrough size={13} /> },
            ] as { cmd: string; icon: React.ReactNode }[]).map(({ cmd, icon }) => (
              <button key={cmd} onMouseDown={(e) => { e.preventDefault(); exec(cmd); }} className="p-1.5 rounded hover:bg-gray-700 text-white transition-colors">{icon}</button>
            ))}
            <div className="w-px h-4 bg-gray-600 mx-0.5" />
            {([
              { cmd: 'insertUnorderedList', icon: <List size={13} /> },
              { cmd: 'insertOrderedList', icon: <ListOrdered size={13} /> },
            ] as { cmd: string; icon: React.ReactNode }[]).map(({ cmd, icon }) => (
              <button key={cmd} onMouseDown={(e) => { e.preventDefault(); exec(cmd); }} className="p-1.5 rounded hover:bg-gray-700 text-white transition-colors">{icon}</button>
            ))}
          </div>
        )}
        {isEmpty && (
          <span className="absolute top-2 left-3 text-gray-400 text-sm pointer-events-none select-none">
            Write lesson content here...
          </span>
        )}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onMouseUp={checkSelection}
          onKeyUp={checkSelection}
          onBlur={() => setTimeout(() => setFloatingToolbar(null), 150)}
          className="w-full px-3 py-2 min-h-[140px] focus:outline-none
            [&_strong]:font-bold [&_em]:italic [&_u]:underline [&_s]:line-through
            [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:my-2
            [&_h2]:text-xl [&_h2]:font-bold [&_h2]:my-1.5
            [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:my-1
            [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-1
            [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-1
            [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-gray-600 [&_blockquote]:my-2
            [&_pre]:bg-gray-100 [&_pre]:rounded [&_pre]:p-2 [&_pre]:font-mono [&_pre]:text-sm [&_pre]:my-1 [&_pre]:whitespace-pre-wrap
            [&_a]:text-blue-600 [&_a]:underline
            [&_hr]:border-gray-300 [&_hr]:my-2"
        />
      </div>
    </div>
  );
}

// Course Creation Wizard Component
function CourseCreationWizard({ onClose, onSave }: { 
  onClose: () => void; 
  onSave: (course: Course) => void;
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isFree, setIsFree] = useState(false);
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
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [lessonFiles, setLessonFiles] = useState<Record<string, File>>({});
  const [draggingLessonId, setDraggingLessonId] = useState<string | null>(null);
  const [openModules, setOpenModules] = useState<Set<string>>(new Set());
  const dragLesson = useRef<{ moduleId: string; lessonId: string } | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson>({
    id: '',
    title: '',
    content: '',
    duration: '',
    type: 'text'
  });

  const totalSteps = 3;

  // Handle navigation back to courses list
  const handleBackToCourses = () => {
    setCurrentStep(1);
    setCourseData({
      title: '',
      description: '',
      duration: '',
      level: 'Beginner',
      price: '',
      category: 'Leadership',
      instructor: ''
    });
    setIsFree(false);
    setModules([]);
    setSelectedModule(null);
    setUploadedFiles([]);
    onClose();
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

  const addModule = () => {
    const newModule: Module = {
      id: 'mod-' + Date.now(),
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
      id: 'lesson-' + Date.now(),
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
      id: 'lesson-' + Date.now(),
      title: `Quiz ${target.lessons.filter(l => l.type === 'quiz').length + 1}`,
      content: '',
      duration: '',
      type: 'quiz'
    };
    const updatedModule = { ...target, lessons: [...target.lessons, newLesson] };
    setSelectedModule(updatedModule);
    setModules(modules.map(m => m.id === target.id ? updatedModule : m));
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
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-['DM_Sans',sans-serif] font-medium text-gray-700">
                      Price {!isFree && '*'}
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <span className="font-['DM_Sans',sans-serif] text-sm text-gray-600">Free</span>
                      <div
                        onClick={() => {
                          setIsFree(!isFree);
                          if (!isFree) setCourseData({...courseData, price: 'Free'});
                          else setCourseData({...courseData, price: ''});
                        }}
                        className={`relative w-10 h-6 rounded-full transition-colors duration-200 cursor-pointer ${isFree ? 'bg-green-500' : 'bg-gray-300'}`}
                      >
                        <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${isFree ? 'translate-x-4' : 'translate-x-0'}`} />
                      </div>
                    </label>
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

          {/* Step 2: Content (Modules + Lessons) */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-['DM_Sans',sans-serif] font-semibold text-lg">
                  Content
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
                                  <GripVertical size={14} className="text-gray-400 cursor-grab shrink-0" />
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
                                      const updatedLesson = { ...lesson, type: e.target.value as any };
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
                                        const updatedLesson = { ...lesson, attachedFileName: undefined };
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
                                isOpen ? next.delete(module.id) : next.add(module.id);
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
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');
  const navigate = useNavigate();

  // Check if user is admin
  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (!isAdmin) {
      navigate('/admin/login');
    }
  }, [navigate]);

  // Fetch courses from Supabase on mount
  useEffect(() => {
    fetchCourses().then(({ data, error }) => {
      if (!error) setCourses(data as unknown as Course[]);
      setCoursesLoading(false);
    });
  }, []);

  const handleCourseSave = async (newCourse: Course) => {
    const { error } = await saveCourse({
      id: newCourse.id,
      title: newCourse.title,
      description: newCourse.description,
      duration: newCourse.duration,
      level: newCourse.level,
      price: newCourse.price,
      category: newCourse.category,
      instructor: newCourse.instructor,
      modules: newCourse.modules,
    });
    if (!error) {
      setCourses(prev => [newCourse, ...prev]);
    }
    setShowCourseWizard(false);
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
                    <div key={course.id} className={`relative rounded-xl ${styles.bgColor} border ${styles.borderColor} p-6 hover:shadow-lg transition-shadow`}>
                      <div className="flex flex-col gap-4 h-full">
                        <div className="flex items-start justify-between">
                          <h3 className={`font-['DM_Sans',sans-serif] font-bold text-2xl tracking-tight ${styles.titleColor}`}>{course.title}</h3>
                          <span className={`text-xs px-3 py-1 rounded-full border whitespace-nowrap ${styles.categoryBg}`}>
                            {course.category}
                          </span>
                        </div>
                        <p className="font-['DM_Sans',sans-serif] text-black text-lg">{course.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600">
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
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-auto">
                          <div className={`font-['DM_Sans',sans-serif] font-bold text-2xl ${styles.titleColor}`}>
                            {course.price === 'Free' ? 'Free' : course.price ? `₦${course.price}` : ''}
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => {/* Handle edit */}}
                              className={`${styles.buttonBg} text-white px-4 py-2 rounded-lg ${styles.buttonHover} transition-colors font-['DM_Sans',sans-serif] font-bold text-sm`}
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => {/* Handle delete */}}
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
                  onClick={() => setShowCourseWizard(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Admin Dashboard
                </button>
                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                <span className="text-gray-900 font-medium">Create New Course</span>
              </nav>

              <CourseCreationWizard
                onClose={() => setShowCourseWizard(false)}
                onSave={handleCourseSave}
              />
            </div>
          )}

          {activeSection === 'jobs' && <JobOpenings />}
        </main>
      </div>
    </div>
  );
}

// Comprehensive course content with modules, lessons, and assessments
export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'single' | 'multi';
  options: QuizOption[];
  correctAnswers: string[];
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  duration: string;
  type: 'video' | 'text' | 'quiz' | 'assignment';
  videoUrl?: string;
  videoDescription?: string;
  attachedFileName?: string;
  attachedFileUrl?: string;
  attachedFilePath?: string;
  quizQuestions?: QuizQuestion[];
  completed?: boolean;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  completed?: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  price: string;
  category: string;
  instructor: string;
  modules: Module[];
  thumbnailUrl?: string;
  finalAssessment?: {
    questions: {
      id: string;
      question: string;
      options: string[];
      correctAnswer: number;
    }[];
    passingScore: number;
  };
}


export const coursesData: Course[] = [];

export default coursesData;

import { Course } from '../data/courseContent';

export interface UserProgress {
  courseId: string;
  completedLessons: string[];
  completedModules: string[];
  currentLesson: string;
  currentModule: string;
  progressPercentage: number;
  timeSpent: number;
  lastAccessed: string;
  completed: boolean;
  certificateIssued: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  enrolledCourses: string[];
  progress: Record<string, UserProgress>;
  certificates: {
    courseId: string;
    courseName: string;
    issuedDate: string;
    certificateUrl: string;
  }[];
}

class ProgressTracker {
  private storageKey = 'cr8careers_user_profile';

  // Get user profile from localStorage
  getUserProfile(): UserProfile | null {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error loading user profile:', error);
      return null;
    }
  }

  // Save user profile to localStorage
  saveUserProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(profile));
    } catch (error) {
      console.error('Error saving user profile:', error);
    }
  }

  // Initialize user profile
  initializeUserProfile(name: string, email: string): UserProfile {
    const profile: UserProfile = {
      id: 'user_' + Date.now(),
      name,
      email,
      enrolledCourses: [],
      progress: {},
      certificates: []
    };
    
    this.saveUserProfile(profile);
    return profile;
  }

  // Enroll user in a course
  enrollInCourse(courseId: string, course: Course): void {
    let profile = this.getUserProfile();
    if (!profile) {
      // Create a default profile if none exists
      profile = this.initializeUserProfile('John Doe', 'john@example.com');
    }

    if (!profile.enrolledCourses.includes(courseId)) {
      profile.enrolledCourses.push(courseId);
      
      // Initialize progress for this course
      profile.progress[courseId] = {
        courseId,
        completedLessons: [],
        completedModules: [],
        currentLesson: course.modules[0]?.lessons[0]?.id || '',
        currentModule: course.modules[0]?.id || '',
        progressPercentage: 0,
        timeSpent: 0,
        lastAccessed: new Date().toISOString(),
        completed: false,
        certificateIssued: false
      };
      
      this.saveUserProfile(profile);
    }
  }

  // Mark lesson as complete
  completeLesson(courseId: string, lessonId: string, course: Course): void {
    const profile = this.getUserProfile();
    if (!profile || !profile.progress[courseId]) return;

    const progress = profile.progress[courseId];
    
    if (!progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
      progress.lastAccessed = new Date().toISOString();
      
      // Check if module is complete
      const module = course.modules.find(mod => 
        mod.lessons.some(lesson => lesson.id === lessonId)
      );
      
      if (module) {
        const moduleLessonsComplete = module.lessons.every(lesson => 
          progress.completedLessons.includes(lesson.id)
        );
        
        if (moduleLessonsComplete && !progress.completedModules.includes(module.id)) {
          progress.completedModules.push(module.id);
        }
      }
      
      // Update progress percentage
      const totalLessons = course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0);
      progress.progressPercentage = (progress.completedLessons.length / totalLessons) * 100;
      
      // Check if course is complete
      if (progress.completedLessons.length === totalLessons) {
        progress.completed = true;
        this.issueCertificate(courseId, course, profile);
      }
      
      this.saveUserProfile(profile);
    }
  }

  // Update current lesson
  updateCurrentLesson(courseId: string, lessonId: string, moduleId: string): void {
    const profile = this.getUserProfile();
    if (!profile || !profile.progress[courseId]) return;

    profile.progress[courseId].currentLesson = lessonId;
    profile.progress[courseId].currentModule = moduleId;
    profile.progress[courseId].lastAccessed = new Date().toISOString();
    
    this.saveUserProfile(profile);
  }

  // Get course progress
  getCourseProgress(courseId: string): UserProgress | null {
    const profile = this.getUserProfile();
    return profile?.progress[courseId] || null;
  }

  // Issue certificate
  private issueCertificate(courseId: string, course: Course, profile: UserProfile): void {
    if (!profile.progress[courseId].certificateIssued) {
      profile.progress[courseId].certificateIssued = true;
      
      profile.certificates.push({
        courseId,
        courseName: course.title,
        issuedDate: new Date().toISOString(),
        certificateUrl: `certificate-${courseId}-${profile.id}.pdf`
      });
      
      this.saveUserProfile(profile);
    }
  }

  // Get all certificates
  getCertificates(): UserProfile['certificates'] {
    const profile = this.getUserProfile();
    return profile?.certificates || [];
  }

  // Get enrolled courses
  getEnrolledCourses(): string[] {
    const profile = this.getUserProfile();
    return profile?.enrolledCourses || [];
  }

  // Check if user is enrolled in course
  isEnrolled(courseId: string): boolean {
    const profile = this.getUserProfile();
    return profile?.enrolledCourses.includes(courseId) || false;
  }

  // Calculate total learning time
  getTotalLearningTime(): number {
    const profile = this.getUserProfile();
    if (!profile) return 0;
    
    return Object.values(profile.progress).reduce((total, progress) => 
      total + progress.timeSpent, 0
    );
  }

  // Get learning statistics
  getLearningStats(): {
    coursesEnrolled: number;
    coursesCompleted: number;
    totalLessonsCompleted: number;
    totalCertificates: number;
    averageProgress: number;
  } {
    const profile = this.getUserProfile();
    if (!profile) {
      return {
        coursesEnrolled: 0,
        coursesCompleted: 0,
        totalLessonsCompleted: 0,
        totalCertificates: 0,
        averageProgress: 0
      };
    }

    const progressValues = Object.values(profile.progress);
    const coursesCompleted = progressValues.filter(p => p.completed).length;
    const totalLessonsCompleted = progressValues.reduce((total, p) => 
      total + p.completedLessons.length, 0
    );
    const averageProgress = progressValues.length > 0 
      ? progressValues.reduce((sum, p) => sum + p.progressPercentage, 0) / progressValues.length
      : 0;

    return {
      coursesEnrolled: profile.enrolledCourses.length,
      coursesCompleted,
      totalLessonsCompleted,
      totalCertificates: profile.certificates.length,
      averageProgress
    };
  }
}

export const progressTracker = new ProgressTracker();

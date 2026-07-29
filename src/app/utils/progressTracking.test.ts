// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Course } from '../data/courseContent';
import { progressTracker } from './progressTracking';

const course: Course = {
  id: 'test-course', title: 'Test Course', description: '', duration: '', level: '',
  price: '', category: '', instructor: '',
  modules: [{
    id: 'module-1', title: 'Module 1', description: '',
    lessons: [
      { id: 'lesson-1', title: 'One', content: '', duration: '', type: 'text' },
      { id: 'lesson-2', title: 'Two', content: '', duration: '', type: 'text' },
    ],
  }],
};

describe('progressTracker fallback', () => {
  beforeEach(() => {
    const values = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
      removeItem: (key: string) => values.delete(key),
      clear: () => values.clear(),
    });
  });

  it('enrols a learner at zero progress', () => {
    progressTracker.enrollInCourse(course.id, course);
    expect(progressTracker.getCourseProgress(course.id)).toMatchObject({
      completedLessons: [], progressPercentage: 0, completed: false,
    });
  });

  it('issues one certificate only after every lesson is complete', () => {
    progressTracker.enrollInCourse(course.id, course);
    progressTracker.completeLesson(course.id, 'lesson-1', course);
    expect(progressTracker.getCertificates()).toHaveLength(0);
    expect(progressTracker.getCourseProgress(course.id)?.progressPercentage).toBe(50);

    progressTracker.completeLesson(course.id, 'lesson-2', course);
    progressTracker.completeLesson(course.id, 'lesson-2', course);
    expect(progressTracker.getCourseProgress(course.id)?.completed).toBe(true);
    expect(progressTracker.getCertificates()).toHaveLength(1);
  });
});

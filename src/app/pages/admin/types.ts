// Shared types for the admin dashboard feature modules.

export interface CourseFormData {
  title: string;
  description: string;
  duration: string;
  level: string;
  price: string;
  category: string;
  instructor: string;
  thumbnailUrl?: string;
}

export interface JobOpening {
  id: string;
  title: string;
  company: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string;
  salary: string;
  postedDate: string;
  isActive: boolean;
}

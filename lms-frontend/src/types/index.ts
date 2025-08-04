export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_instructor: boolean;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  instructor: User;
  modules: Module[];
  enrolled_students: number;
  is_enrolled?: boolean;
  progress?: number;
}

export interface Module {
  id: number;
  title: string;
  description: string;
  lessons: Lesson[];
  order: number;
}

export interface Lesson {
  id: number;
  title: string;
  description: string;
  content: string;
  video_url?: string;
  duration: number;
  order: number;
  is_completed?: boolean;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
} 
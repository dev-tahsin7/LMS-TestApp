import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  User, 
  Course, 
  Module, 
  Lesson, 
  AuthResponse, 
  LoginCredentials, 
  SignupCredentials,
  ApiResponse 
} from '../types';

const API_BASE_URL = 'https://lms-backend-xpwc.onrender.com';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
              const response = await this.refreshToken(refreshToken);
              localStorage.setItem('access_token', response.access);
              originalRequest.headers.Authorization = `Bearer ${response.access}`;
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/login/', credentials);
    return response.data;
  }

  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/signup/', credentials);
    return response.data;
  }

  async refreshToken(refresh: string): Promise<{ access: string }> {
    const response: AxiosResponse<{ access: string }> = await this.api.post('/auth/token/refresh/', { refresh });
    return response.data;
  }

  async logout(): Promise<void> {
    const refresh = localStorage.getItem('refresh_token');
    if (refresh) {
      await this.api.post('/auth/logout/', { refresh });
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }

  // User endpoints
  async getCurrentUser(): Promise<User> {
    const response: AxiosResponse<User> = await this.api.get('/auth/user/');
    return response.data;
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    const response: AxiosResponse<User> = await this.api.patch('/auth/user/', userData);
    return response.data;
  }

  // Course endpoints
  async getCourses(): Promise<Course[]> {
    const response: AxiosResponse<Course[]> = await this.api.get('/courses/');
    return response.data;
  }

  async getCourse(id: number): Promise<Course> {
    const response: AxiosResponse<Course> = await this.api.get(`/courses/${id}/`);
    return response.data;
  }

  async enrollInCourse(courseId: number): Promise<void> {
    await this.api.post(`/courses/${courseId}/enroll/`);
  }

  async getEnrolledCourses(): Promise<Course[]> {
    const response: AxiosResponse<Course[]> = await this.api.get('/courses/enrolled/');
    return response.data;
  }

  // Lesson endpoints
  async markLessonComplete(lessonId: number): Promise<void> {
    await this.api.post(`/lessons/${lessonId}/complete/`);
  }

  async markLessonIncomplete(lessonId: number): Promise<void> {
    await this.api.delete(`/lessons/${lessonId}/complete/`);
  }

  async getLesson(id: number): Promise<Lesson> {
    const response: AxiosResponse<Lesson> = await this.api.get(`/lessons/${id}/`);
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService; 
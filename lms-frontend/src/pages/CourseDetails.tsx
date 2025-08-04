import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiService from '../services/api';
import { Course, Lesson } from '../types';

const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [completingLesson, setCompletingLesson] = useState<number | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;
      
      try {
        const fetchedCourse = await apiService.getCourse(parseInt(id));
        setCourse(fetchedCourse);
      } catch (error: any) {
        setError('Failed to load course details');
        console.error('Error fetching course:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleLessonToggle = async (lessonId: number, isCompleted: boolean) => {
    setCompletingLesson(lessonId);
    try {
      if (isCompleted) {
        await apiService.markLessonIncomplete(lessonId);
      } else {
        await apiService.markLessonComplete(lessonId);
      }
      
      // Update the lesson completion status in the course
      if (course) {
        const updatedCourse = {
          ...course,
          modules: course.modules.map(module => ({
            ...module,
            lessons: module.lessons.map(lesson => 
              lesson.id === lessonId 
                ? { ...lesson, is_completed: !isCompleted }
                : lesson
            )
          }))
        };
        setCourse(updatedCourse);
      }
    } catch (error: any) {
      setError('Failed to update lesson status');
      console.error('Error updating lesson:', error);
    } finally {
      setCompletingLesson(null);
    }
  };

  const calculateProgress = () => {
    if (!course) return 0;
    
    const totalLessons = course.modules.reduce((total, module) => 
      total + module.lessons.length, 0
    );
    const completedLessons = course.modules.reduce((total, module) => 
      total + module.lessons.filter(lesson => lesson.is_completed).length, 0
    );
    
    return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="space-y-2">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="h-3 bg-gray-200 rounded w-full"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Course not found</h1>
            <Link to="/courses" className="btn-primary">
              Back to Courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const progress = calculateProgress();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="mb-8">
          <Link to="/courses" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            ← Back to Courses
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
          <p className="text-gray-600 mb-6">{course.description}</p>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Course Progress</h3>
                <p className="text-sm text-gray-500">
                  {course.modules.reduce((total, module) => 
                    total + module.lessons.filter(lesson => lesson.is_completed).length, 0
                  )} of {course.modules.reduce((total, module) => 
                    total + module.lessons.length, 0
                  )} lessons completed
                </p>
              </div>
              <span className="text-2xl font-bold text-blue-600">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-6">
            {course.modules.map((module) => (
              <div key={module.id} className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Module {module.order}: {module.title}
                  </h3>
                  <p className="text-gray-600">{module.description}</p>
                </div>
                <div className="divide-y divide-gray-200">
                  {module.lessons.map((lesson) => (
                    <div key={lesson.id} className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h4 className="text-md font-medium text-gray-900">
                              Lesson {lesson.order}: {lesson.title}
                            </h4>
                            {lesson.is_completed && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Completed
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{lesson.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span>Duration: {lesson.duration} minutes</span>
                            {lesson.video_url && (
                              <span>• Video available</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleLessonToggle(lesson.id, !!lesson.is_completed)}
                            disabled={completingLesson === lesson.id}
                            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                              lesson.is_completed
                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {completingLesson === lesson.id 
                              ? 'Updating...' 
                              : lesson.is_completed 
                                ? 'Mark Incomplete' 
                                : 'Mark Complete'
                            }
                          </button>
                          <Link
                            to={`/lessons/${lesson.id}`}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            View →
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails; 
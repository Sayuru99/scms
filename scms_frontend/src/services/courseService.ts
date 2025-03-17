import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:7200";

interface ApiError {
  status: string;
  message: string;
}

async function apiRequest<T, D = unknown>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  data?: D,
  token?: string,
  showSuccess: boolean = false
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    if (!response.ok) {
      const text = await response.text();
      const errorMessage = text.includes("<!DOCTYPE")
        ? `Request failed: ${response.status} ${response.statusText}`
        : (JSON.parse(text) as ApiError).message || "Request failed";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }

    const result = await response.json();
    if (showSuccess) {
      toast.success("Operation completed successfully");
    }
    return result as T;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An error occurred");
  }
}

export interface ModuleData {
  name: string;
  semester: string;
  credits?: number;
  isMandatory: boolean;
  lecturerId?: string;
}

export interface CourseData {
  code: string;
  name: string;
  description?: string;
  credits: number;
  modules?: ModuleData[];
}

export interface Course {
  id: number;
  code: string;
  name: string;
  description?: string;
  credits: number;
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
  };
  modules: {
    id: number;
    name: string;
    semester: string;
    credits: number;
    isMandatory: boolean;
    lecturer: {
      id: string;
      firstName: string;
      lastName: string;
    };
  }[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export const courseService = {
  createCourse: (courseData: CourseData, token: string) =>
    apiRequest<{ message: string; course: Course }>(
      '/api/courses',
      'POST',
      courseData,
      token,
      true
    ),

  getCourses: (token: string, params?: { page?: number; limit?: number; code?: string; name?: string }) =>
    apiRequest<{ courses: Course[]; total: number; page: number; limit: number }>(
      '/api/courses',
      'GET',
      params,
      token
    ),

  updateCourse: (courseId: number, courseData: Partial<CourseData>, token: string) =>
    apiRequest<{ message: string; course: Course }>(
      `/api/courses/${courseId}`,
      'PUT',
      courseData,
      token,
      true
    ),

  deleteCourse: (courseId: number, token: string) =>
    apiRequest<{ message: string; courseId: number }>(
      `/api/courses/${courseId}`,
      'DELETE',
      undefined,
      token,
      true
    ),
}; 
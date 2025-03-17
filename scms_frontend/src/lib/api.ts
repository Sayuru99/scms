import { toast } from "react-toastify";
import { io, Socket } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:7200";

interface ApiError {
  status: string;
  message: string;
}

async function apiRequest<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  data?: any,
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

export const authService = {
  login: (email: string, password: string) =>
    apiRequest<{
      accessToken: string;
      refreshToken: string;
      isFirstLogin: boolean;
    }>("/api/auth/login", "POST", { email, password }, undefined, true),

  refreshToken: (refreshToken: string) =>
    apiRequest<{ accessToken: string; refreshToken: string }>(
      "/api/auth/refresh",
      "POST",
      { refreshToken }
    ),

  logout: (refreshToken?: string, token?: string) =>
    apiRequest<void>("/api/auth/logout", "POST", { refreshToken }, token, true),
};

export const userService = {
  getUsers: (token: string) =>
    apiRequest<User[]>("/api/users", "GET", undefined, token),

  createUser: (userData: CreateUserData, token: string) =>
    apiRequest<{ message: string; userId: string }>(
      "/api/users",
      "POST",
      userData,
      token,
      true
    ),

  updateUser: (userId: string, updates: UpdateUserData, token: string) =>
    apiRequest<{ message: string; userId: string }>(
      `/api/users/${userId}`,
      "PUT",
      updates,
      token,
      true
    ),

  deleteUser: (userId: string, token: string) =>
    apiRequest<{ message: string; userId: string }>(
      `/api/users/${userId}`,
      "DELETE",
      undefined,
      token,
      true
    ),

  updateSelf: (
    updates: {
      email: string;
      firstName: string;
      lastName: string;
      phoneNumber: string;
    },
    token: string
  ) =>
    apiRequest<{ message: string; userId: string }>(
      `/api/users/me`,
      "PUT",
      updates,
      token,
      true
    ),
};

export const roleService = {
  createRole: (
    name: string,
    description: string | undefined,
    permissionNames: string[],
    token: string
  ) =>
    apiRequest<{ message: string; roleId: string }>(
      "/api/roles",
      "POST",
      { name, description, permissionNames },
      token,
      true
    ),

  getRoles: (token: string) =>
    apiRequest<Role[]>("/api/roles", "GET", undefined, token),

  updateRole: (
    roleId: string,
    name: string,
    description: string | undefined,
    permissionNames: string[],
    token: string
  ) =>
    apiRequest<{ message: string; roleId: string }>(
      `/api/roles/${roleId}`,
      "PUT",
      { name, description, permissionNames },
      token,
      true
    ),

  deleteRole: (roleId: string, token: string) =>
    apiRequest<{ message: string; roleId: string }>(
      `/api/roles/${roleId}`,
      "DELETE",
      undefined,
      token,
      true
    ),
};

export const permissionService = {
  createPermission: (
    name: string,
    category: string,
    scope: string | undefined,
    description: string,
    token: string
  ) =>
    apiRequest<{ message: string; permissionId: string }>(
      "/api/permissions",
      "POST",
      { name, category, scope, description },
      token,
      true
    ),

  getPermissions: (token: string) =>
    apiRequest<Permission[]>("/api/permissions", "GET", undefined, token),

  updatePermission: (
    permissionId: string,
    name: string,
    category: string,
    scope: string | undefined,
    description: string,
    token: string
  ) =>
    apiRequest<{ message: string; permissionId: string }>(
      `/api/permissions/${permissionId}`,
      "PUT",
      { name, category, scope, description },
      token,
      true
    ),

  deletePermission: (permissionId: string, token: string) =>
    apiRequest<{ message: string; permissionId: string }>(
      `/api/permissions/${permissionId}`,
      "DELETE",
      undefined,
      token,
      true
    ),
};

export const resourceService = {
  getResources: (
    token: string,
    page: number = 1,
    limit: number = 10,
    status?: string,
    typeId?: number
  ) =>
    apiRequest<{
      resources: Resource[];
      total: number;
      page: number;
      limit: number;
    }>(
      `/api/resources?page=${page}&limit=${limit}${
        status ? `&status=${status}` : ""
      }${typeId ? `&typeId=${typeId}` : ""}`,
      "GET",
      undefined,
      token
    ),

  createResource: (
    data: {
      name: string;
      description?: string;
      typeId: number;
      status?: string;
    },
    token: string
  ) =>
    apiRequest<{ message: string; resource: Resource }>(
      "/api/resources",
      "POST",
      data,
      token,
      true
    ),

  updateResource: (
    resourceId: number,
    updates: {
      name?: string;
      description?: string;
      typeId?: number;
      status?: string;
    },
    token: string
  ) =>
    apiRequest<{ message: string; resource: Resource }>(
      `/api/resources/${resourceId}`,
      "PUT",
      updates,
      token,
      true
    ),

  deleteResource: (resourceId: number, token: string) =>
    apiRequest<{ message: string; resourceId: number }>(
      `/api/resources/${resourceId}`,
      "DELETE",
      undefined,
      token,
      true
    ),

  getResourceTypes: (token: string) =>
    apiRequest<ResourceType[]>("/api/resources/types", "GET", undefined, token),

  createResourceType: (type: string, token: string) =>
    apiRequest<{ message: string; resourceType: ResourceType }>(
      "/api/resources/types",
      "POST",
      { type },
      token,
      true
    ),

  updateResourceType: (typeId: number, type: string, token: string) =>
    apiRequest<{ message: string; resourceType: ResourceType }>(
      `/api/resources/types/${typeId}`,
      "PUT",
      { type },
      token,
      true
    ),

  deleteResourceType: (typeId: number, token: string) =>
    apiRequest<{ message: string; typeId: number }>(
      `/api/resources/types/${typeId}`,
      "DELETE",
      undefined,
      token,
      true
    ),


    // new reservation
    getReservationsByID: (
      token: string,
      page: number = 1,
      limit: number = 5
    ) =>
      apiRequest<{
        reservations: Reservation[];
        total: number;
        page: number;
        limit: number;
      }>(
        `/api/resources/reservations/user/?page=${page}&limit=${limit}`,
        "GET",
        undefined,
        token
      ),

  getReservations: (
    token: string,
    page: number = 1,
    limit: number = 5,
    status?: string
  ) =>
    apiRequest<{
      reservations: Reservation[];
      total: number;
      page: number;
      limit: number;
    }>(
      `/api/resources/reservations?page=${page}&limit=${limit}${
        status ? `&status=${status}` : ""
      }`,
      "GET",
      undefined,
      token
    ),

  createReservation: (
    data: {
      resourceId: number;
      startTime: string;
      endTime: string;
      purpose?: string;
    },
    token: string
  ) =>
    apiRequest<{ message: string; reservation: Reservation }>(
      "/api/resources/reservations",
      "POST",
      data,
      token,
      true
    ),

  updateReservation: (reservationId: number, status: string, token: string) =>
    apiRequest<{ message: string; reservation: Reservation }>(
      `/api/resources/reservations/${reservationId}`,
      "PUT",
      { status },
      token,
      true
    ),

  requestResource: (
    resourceId: number,
    data: { startTime: string; endTime: string; purpose?: string },
    token: string
  ) =>
    apiRequest<{ message: string; reservation: any }>(
      `/api/resources/${resourceId}/request`,
      "POST",
      data,
      token,
      true
    ),

  returnResource: (resourceId: number, token: string) =>
    apiRequest<{ message: string }>(
      `/api/resources/${resourceId}/return`,
      "POST",
      undefined,
      token,
      true
    ),
};

export interface Course {
  id: number;
  code: string;
  name: string;
  description?: string;
  credits: number;
  modules: {
    id: number;
    name: string;
    code?: string;
    semester: string;
    credits: number;
    isMandatory: boolean;
    lecturer?: {
      id: string;
      firstName: string;
      lastName: string;
    };
  }[];
}

export interface CourseData {
  name: string;
  code: string;
  description?: string;
  credits: number;
  modules: {
    name: string;
    semester: string;
    credits: number;
    isMandatory: boolean;
  }[];
}

export const courseService = {
  getEnrolledCourses: (token: string, page: number = 1, limit: number = 10) =>
    apiRequest<{ courses: any[]; total: number; page: number; limit: number }>(
      `/api/courses/enrolled?page=${page}&limit=${limit}`,
      "GET",
      undefined,
      token,
      true
    ),

  getAvailableCourses: (token: string, page: number = 1, limit: number = 10) =>
    apiRequest<{ courses: any[]; total: number; page: number; limit: number }>(
      `/api/courses/available?page=${page}&limit=${limit}`,
      "GET",
      undefined,
      token,
      true
    ),

  enrollStudent: (courseId: number, token: string) =>
    apiRequest<{ message: string; enrollment: any }>(
      `/api/courses/${courseId}/enroll`,
      "POST",
      undefined,
      token,
      true
    ),

  createCourse: (courseData: CourseData, token: string) =>
    apiRequest<{ message: string; course: Course }>(
      '/api/courses',
      'POST',
      courseData,
      token,
      true
    ),

  getCourseById: (courseId: number, token: string) =>
    apiRequest<Course>(
      `/api/courses/${courseId}`,
      'GET',
      undefined,
      token,
      true
    ),

  getCourses: (token: string, params?: { page?: number; limit?: number; code?: string; name?: string }) =>
    apiRequest<{ courses: Course[]; total: number; page: number; limit: number }>(
      `/api/courses${params ? `?${new URLSearchParams(params as any).toString()}` : ''}`,
      'GET',
      undefined,
      token,
      true
    ),

  updateCourse: (courseId: number, courseData: CourseData, token: string) =>
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
      "DELETE",
      undefined,
      token,
      true
    ),
};

export const chatService = {
  getMessages: (recipientId: string, token: string) =>
    apiRequest<any[]>(
      `/api/chat/messages/${recipientId}`,
      "GET",
      undefined,
      token
    ),

  getGroupMessages: (groupId: number, token: string) =>
    apiRequest<any[]>(
      `/api/chat/group-messages/${groupId}`,
      "GET",
      undefined,
      token
    ),

  getGroups: (token: string) =>
    apiRequest<any[]>("/api/chat/groups", "GET", undefined, token),

  initializeSocket: (token: string): Socket => {
    const socket = io(BASE_URL, {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    return socket;
  },
};

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: Role;
  directPermissions?: string;
  isActive: boolean;
  isFirstLogin: boolean;
  isDeleted: boolean;
}

export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  roleName: string;
  directPermissionNames?: string[];
}

export interface UpdateUserData {
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  roleName?: string;
  directPermissionNames?: string[];
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  name: string;
  category: string;
  scope?: string;
  description: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Resource {
  id: number;
  name: string;
  description?: string;
  type: ResourceType;
  status: "Available" | "Reserved" | "Maintenance";
  isDeleted: boolean;
}

export interface ResourceType {
  id: number;
  type: string;
  isDeleted: boolean;
}

export interface Reservation {
  id: number;
  user: User;
  resource: Resource;
  startTime: string;
  endTime: string;
  status: "Pending" | "Approved" | "Rejected" | "Cancelled";
  purpose?: string;
  approvedBy?: User;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

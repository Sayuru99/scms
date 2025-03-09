import { toast } from "react-toastify";

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

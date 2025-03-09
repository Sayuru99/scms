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
    const result = await response.json();

    if (!response.ok) {
      const errorMessage = (result as ApiError).message || "Request failed";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }

    if (showSuccess) {
      toast.success("Operation completed successfully");
    }

    return result as T;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An error occurred");
    }

    throw error;
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
      "/api/users/" + userId,
      "PUT",
      updates,
      token,
      true
    ),

  deleteUser: (userId: string, token: string) =>
    apiRequest<{ message: string; userId: string }>(
      "/api/users/" + userId,
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
  role: { name: string };
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

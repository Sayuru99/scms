import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { authService } from "../lib/api";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

interface JwtPayload {
  userId: string;
  role: string;
  permissions: string[];
  exp: number;
}

const ProtectedRoute = () => {
  const { userId, setAuth } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = Cookies.get("accessToken");
      const refreshToken = Cookies.get("refreshToken");

      if (userId && accessToken) {
        try {
          const decoded: JwtPayload = jwtDecode(accessToken);
          const currentTime = Math.floor(Date.now() / 1000);
          if (decoded.exp > currentTime) {
            setIsAuthenticated(true);
            return;
          }
        } catch (err) {
          console.error("Invalid access token:", err);
        }
      }

      if (refreshToken) {
        try {
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            await authService.refreshToken(refreshToken);
          setAuth(newAccessToken); 
          Cookies.set("accessToken", newAccessToken, { expires: 1 / 96 });
          Cookies.set("refreshToken", newRefreshToken, { expires: 7 });
          setIsAuthenticated(true);
          toast.success("Session refreshed successfully");
          return;
        } catch (err) {
          console.error("Refresh token failed:", err);
          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");
          toast.error("Session expired. Please log in again.");
        }
      }

      setIsAuthenticated(false);
    };

    checkAuth();
  }, [userId, setAuth]);

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <svg
          className="animate-spin h-8 w-8 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
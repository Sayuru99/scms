import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  userId: string;
  role: string;
  permissions: string[];
  exp: number;
}

interface AuthContextType {
  userId: string | null;
  permissions: string[];
  setAuth: (token: string) => void;
  clearAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      try {
        const decoded: JwtPayload = jwtDecode(accessToken);
        setUserId(decoded.userId);
        setPermissions(decoded.permissions || []);
      } catch (err) {
        console.error("Failed to decode token on init:", err);
      }
    }
  }, []);

  const setAuth = (token: string) => {
    try {
      const decoded: JwtPayload = jwtDecode(token);
      setUserId(decoded.userId);
      setPermissions(decoded.permissions || []);
      Cookies.set("accessToken", token, { expires: 1 }); 
    } catch (err) {
      console.error("Failed to set auth:", err);
    }
  };

  const clearAuth = () => {
    setUserId(null);
    setPermissions([]);
    Cookies.remove("accessToken");
  };

  return (
    <AuthContext.Provider value={{ userId, permissions, setAuth, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
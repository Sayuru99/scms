import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import CourseBuilder from "./components/CourseBuilder";
import CourseNav from "@/components/navigation/CourseNav";

interface JwtPayload {
  userId: string;
  role: string;
  permissions: string[];
  exp: number;
}

function ManageCourse() {
  const [permissions, setPermissions] = useState<string[]>([]);

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      try {
        const decoded: JwtPayload = jwtDecode(accessToken);
        setPermissions(decoded.permissions || []);
      } catch (err) {
        console.error("Failed to decode token:", err);
      }
    }
  }, []);

  return (
    <div className="p-6">
      <CourseNav permissions={permissions} />
      <CourseBuilder />
    </div>
  );
}

export default ManageCourse;
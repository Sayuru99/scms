import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { courseService, Course } from "../../lib/api";
import { toast } from "react-toastify";
import AvailableCoursesTable from "./components/AvailableCoursesTable";
import CourseNav from "@/components/navigation/CourseNav";

interface JwtPayload {
  userId: string;
  role: string;
  permissions: string[];
  exp: number;
}

function Courses() {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      try {
        const decoded: JwtPayload = jwtDecode(accessToken);
        setPermissions(decoded.permissions || []);
        if (decoded.permissions.includes("read:courses")) {
          fetchAvailableCourses(accessToken);
        }
      } catch (err) {
        console.error("Failed to decode token:", err);
      }
    }
  }, []);

  const fetchAvailableCourses = async (token: string) => {
    try {
      const response = await courseService.getAvailableCourses(token);
      setAvailableCourses(response.courses);
    } catch (err) {
      console.error("Failed to fetch available courses:", err);
      toast.error("Failed to load available courses");
    }
  };

  return (
    <div className="p-6">
      <CourseNav permissions={permissions} />
      {permissions.includes("read:courses") ? (
        <AvailableCoursesTable courses={availableCourses} />
      ) : (
        <div>
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p>You do not have permission to view courses.</p>
        </div>
      )}
    </div>
  );
}

export default Courses;
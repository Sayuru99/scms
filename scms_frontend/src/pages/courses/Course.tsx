
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { courseService } from "../../lib/api";
import { toast } from "react-toastify";
import EnrolledCoursesTable from "./components/EnrolledCoursesTable";
import AvailableCoursesCard from "./components/AvailableCoursesCard";
import UpcomingExamsTable from "./components/UpcomingExamsTable";
import CreateCourseDialog from "./components/CreateCourseDialog";
import EditCourseDialog from "./components/EditCourseDialog";

interface JwtPayload {
  userId: string;
  role: string;
  permissions: string[];
  exp: number;
}

function Courses() {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [, setRole] = useState<string>("");
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  const [upcomingExams, setUpcomingExams] = useState<any[]>([]);
  const [newCourse, setNewCourse] = useState({ code: "", name: "", description: "", credits: "" });
  const [editCourse, setEditCourse] = useState<any | null>(null);

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      try {
        const decoded: JwtPayload = jwtDecode(accessToken);
        setPermissions(decoded.permissions || []);
        setRole(decoded.role);
        if (decoded.permissions.includes("read:courses")) {
          fetchEnrolledCourses(accessToken);
          fetchAvailableCourses(accessToken);
          fetchUpcomingExams();
        }
      } catch (err) {
        console.error("Failed to decode token:", err);
      }
    }
  }, []);

  const fetchEnrolledCourses = async (token: string) => {
    try {
      const data = await courseService.getEnrolledCourses(token);
      setEnrolledCourses(data.courses);
    } catch (err) {
      console.error("Failed to fetch enrolled courses:", err);
      toast.error("Failed to load enrolled courses");
    }
  };

  const fetchAvailableCourses = async (token: string) => {
    try {
      const data = await courseService.getAvailableCourses(token);
      setAvailableCourses(data.courses);
    } catch (err) {
      console.error("Failed to fetch available courses:", err);
      toast.error("Failed to load available courses");
    }
  };

  const fetchUpcomingExams = () => {
    
    setUpcomingExams([
      { id: 1, name: "Midterm Exam - CS101", date: "2025-03-20T10:00:00", course: "CS101" },
      { id: 2, name: "Final Exam - MATH201", date: "2025-04-15T14:00:00", course: "MATH201" },
    ]);
  };

  const handleEnroll = async (courseId: number) => {
    const token = Cookies.get("accessToken");
    if (!token) return;

    try {
      await courseService.enrollStudent(courseId, token);
      fetchEnrolledCourses(token);
      fetchAvailableCourses(token);
      toast.success("Enrolled successfully");
    } catch (err) {
      console.error("Failed to enroll:", err);
      toast.error("Failed to enroll");
    }
  };

  const handleDeleteCourse = async (courseId: number) => {
    const token = Cookies.get("accessToken");
    if (!token) return;

    try {
      await courseService.deleteCourse(courseId, token); 
      fetchEnrolledCourses(token);
      fetchAvailableCourses(token);
      toast.success("Course deleted successfully");
    } catch (err) {
      console.error("Failed to delete course:", err);
      toast.error("Failed to delete course");
    }
  };

  return (
    <>
      {permissions.includes("read:courses") ? (
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6">Courses</h1>

          {permissions.includes("create:courses") && (
            <CreateCourseDialog
              newCourse={newCourse}
              setNewCourse={setNewCourse}
              onCreate={() => {
                fetchEnrolledCourses(Cookies.get("accessToken") || "");
                fetchAvailableCourses(Cookies.get("accessToken") || "");
              }}
            />
          )}

          <EnrolledCoursesTable
            courses={enrolledCourses}
            permissions={permissions}
            onEditCourse={setEditCourse}
            onDeleteCourse={handleDeleteCourse}
          />
          <AvailableCoursesCard
            courses={availableCourses}
            permissions={permissions}
            onEnroll={handleEnroll}
          />
          <UpcomingExamsTable exams={upcomingExams} />

          {editCourse && (
            <EditCourseDialog
              editCourse={editCourse}
              setEditCourse={setEditCourse}
              onUpdate={() => {
                fetchEnrolledCourses(Cookies.get("accessToken") || "");
                fetchAvailableCourses(Cookies.get("accessToken") || "");
              }}
            />
          )}
        </div>
      ) : (
        <div className="p-6">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p>You do not have permission to view courses.</p>
        </div>
      )}
    </>
  );
}

export default Courses;
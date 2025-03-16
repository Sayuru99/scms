import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { courseService } from "../../lib/api";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import EnrolledCoursesTable from "./components/EnrolledCoursesTable";
import AvailableCoursesTable from "./components/AvailableCoursesTable";
import UpcomingExamsTable from "./components/UpcomingExamsTable";
import CreateCourseDialog from "./components/CreateCourseDialog";
import EditCourseDialog from "./components/EditCourseDialog";

interface Course {
  id: number;
  code: string;
  name: string;
  description?: string;
  credits: number;
}

interface Exam {
  id: number;
  name: string;
  date: string;
  course: string;
}

function Courses() {
  const { userId, permissions } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [upcomingExams, setUpcomingExams] = useState<Exam[]>([]);
  const [newCourse, setNewCourse] = useState({
    code: "",
    name: "",
    description: "",
    credits: "",
  });
  const [editCourse, setEditCourse] = useState<Course | null>(null);

  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (token && userId && permissions.includes("read:courses")) {
      fetchEnrolledCourses(token);
      fetchAvailableCourses(token);
      fetchUpcomingExams();
    }
  }, [userId, permissions]);

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
                const token = Cookies.get("accessToken") || "";
                fetchEnrolledCourses(token);
                fetchAvailableCourses(token);
              }}
            />
          )}

          <EnrolledCoursesTable
            courses={enrolledCourses}
            permissions={permissions}
            onEditCourse={setEditCourse}
            onDeleteCourse={handleDeleteCourse}
          />
          <AvailableCoursesTable
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
                const token = Cookies.get("accessToken") || "";
                fetchEnrolledCourses(token);
                fetchAvailableCourses(token);
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
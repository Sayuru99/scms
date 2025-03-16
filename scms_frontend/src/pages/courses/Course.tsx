import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { courseService } from "../../lib/api";
import { toast } from "react-toastify";
import AvailableCoursesTable from "./components/AvailableCoursesTable";
import CreateCourseDialog from "./components/CreateCourseDialog";
import EditCourseDialog from "./components/EditCourseDialog";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

interface JwtPayload {
  userId: string;
  role: string;
  permissions: string[];
  exp: number;
}

function Courses() {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  const [newCourse, setNewCourse] = useState({ code: "", name: "", description: "", credits: "" });
  const [editCourse, setEditCourse] = useState<any | null>(null);

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      try {
        const decoded: JwtPayload = jwtDecode(accessToken);
        setPermissions(decoded.permissions || []);
        if (decoded.permissions.includes("read:courses")) {
          fetchEnrolledCourses(accessToken);
          fetchAvailableCourses(accessToken);
        }
      } catch (err) {
        console.error("Failed to decode token:", err);
      }
    }
  }, [userId, permissions]);

  const fetchEnrolledCourses = async (token: string) => {
    try {
      const data = await courseService.getEnrolledCourses(token);
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

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="#">Courses</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>Add Course</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {permissions.includes("read:courses") ? (
        <div className="p-6">
          {/* <h1 className="text-3xl font-bold mb-6">Courses</h1> */}

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

          <AvailableCoursesTable
            courses={availableCourses}
            permissions={permissions}
            onEnroll={handleEnroll}
          />

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
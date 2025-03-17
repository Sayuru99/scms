import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { courseService } from "../../lib/api";
import { toast } from "react-toastify";
import AvailableCoursesTable from "./components/AvailableCoursesTable";
import CreateCourseDialog from "./components/CreateCourseDialog";
import EditCourseDialog from "./components/EditCourseDialog";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

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
  }, []);

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
            <BreadcrumbLink href="#">
              Courses
            </BreadcrumbLink>
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
            <div className="flex justify-end mb-4">
            <Button 
            onClick={() => navigate('/courses/manage/')}>
              <Plus className="w-4 h-4 mr-2" /> Add Course</Button>
          </div>
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
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { courseService, Course } from "../../lib/api";
import { toast } from "react-toastify";
import AvailableCoursesTable from "./components/AvailableCoursesTable";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface JwtPayload {
  userId: string;
  role: string;
  permissions: string[];
  exp: number;
}

function Courses() {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

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

  const getBreadcrumbItems = () => {
    const path = location.pathname;
    
    if (path === '/courses') {
      return (
        <BreadcrumbItem>
          <BreadcrumbPage>Courses</BreadcrumbPage>
        </BreadcrumbItem>
      );
    }

    return null;
  };

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          {getBreadcrumbItems()}
        </BreadcrumbList>
      </Breadcrumb>
      {permissions.includes("read:courses") ? (
        <div className="p-6">
          {permissions.includes("create:courses") && (
            <div className="flex justify-end mb-4">
              <Button onClick={() => navigate('/courses/manage/')}>
                <Plus className="w-4 h-4 mr-2" /> Add Course
              </Button>
            </div>
          )}

          <AvailableCoursesTable
            courses={availableCourses}
          />
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
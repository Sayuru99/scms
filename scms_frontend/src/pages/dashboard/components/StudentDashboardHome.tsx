import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";
import StudentCourseCard from "./StudentCourseCard";
import { courseService } from "../../../lib/api";
import ModuleSelection, { SemesterData } from "./ModuleSelection";

interface Course {
  id: number;
  name: string;
  credits: number;
  modules?: Array<{
    id: number;
    name: string;
    code?: string;
    credits?: number;
    semester: string;
    isMandatory: boolean;
    lecturer?: { id: string };
  }>;
}

const StudentDashboardHome: React.FC = () => {
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      try {
        jwtDecode(accessToken);
        fetchCourses(accessToken);
      } catch (err) {
        console.error("Failed to decode token:", err);
      }
    }
  }, []);

  const fetchCourses = async (token: string) => {
    setLoading(true);
    try {
      const fetchedCourses = await courseService.getEnrolledCourses(token);
      setCourses(fetchedCourses.courses);
      setFilteredCourses(fetchedCourses.courses);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
      setError("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const handleCourseClick = async (courseId: number) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    if (courseId === selectedCourse?.id) {
      setSelectedCourse(null);
      return;
    }

    const token = Cookies.get("accessToken");
    if (!token) return;

    try {
      const courseDetails = await courseService.getCourseById(courseId, token);
      setSelectedCourse(courseDetails);
    } catch (err) {
      console.error("Failed to fetch course details:", err);
    }
  };

  const transformCourseToSemesters = (course: Course): SemesterData[] => {
    if (!course.modules) return [];

    const semesterMap = new Map<string, SemesterData>();
    
    course.modules.forEach(module => {
      if (!semesterMap.has(module.semester)) {
        semesterMap.set(module.semester, {
          id: module.semester,
          name: module.semester,
          modules: []
        });
      }

      const semester = semesterMap.get(module.semester)!;
      semester.modules.push({
        id: module.id.toString(),
        title: module.name,
        credits: module.credits || 0,
        schedule: "Schedule TBD", // You might want to add this to your module data
        actionType: "view"
      });
    });

    return Array.from(semesterMap.values());
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container px-4 py-4 mx-4 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-2 text-center"
      >
      </motion.div>

      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12"
      >
        {filteredCourses.map((course) => (
          <StudentCourseCard
            key={course.id}
            title={course.name}
            duration={course.credits.toString()}
            modules={course.modules?.length || 0}
            isPrimary={true}
            onClick={() => handleCourseClick(course.id)}
          />
        ))}
      </motion.div>
     
      <div className="container mx-auto p-4">
        {selectedCourse && (
          <ModuleSelection 
            title={`Module Selection - ${selectedCourse.name}`} 
            semesters={transformCourseToSemesters(selectedCourse)} 
          />
        )}
      </div>
    </div>
  );
};

export default StudentDashboardHome;

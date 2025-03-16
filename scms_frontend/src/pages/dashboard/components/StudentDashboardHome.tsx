import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";
import StudentCourseCard from "./StudentCourseCard";
import { courseService } from "../../../lib/api";
import { AnimatePresence } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import ModuleSelection, { SemesterData } from "./ModuleSelection";

interface Course {
  id: string;
  name: string;
  credits: number;
}

const exampleSemesters: SemesterData[] = [
  {
    id: "semester1",
    name: "Semester 1",
    modules: [
      {
        id: "module1",
        title: "Software Development Practice",
        credits: 30,
        schedule: "Mon, Wed (9:00 AM - 11:00 AM)",
        actionType: "view",
      },
      {
        id: "module2",
        title: "Individual Project",
        credits: 50,
        schedule: "Tue, Thu (2:00 PM - 4:00 PM)",
        actionType: "register",
      },
      {
        id: "module3",
        title: "Advanced Programming",
        credits: 20,
        schedule: "Wed, Fri (1:00 PM - 3:00 PM)",
        actionType: "register",
      },
    ],
  },
  {
    id: "semester2",
    name: "Semester 2",
    modules: [
      {
        id: "module4",
        title: "Web Application Development",
        credits: 25,
        schedule: "Mon, Thu (10:00 AM - 12:00 PM)",
        actionType: "view",
      },
      {
        id: "module5",
        title: "Database Systems",
        credits: 20,
        schedule: "Tue, Fri (9:00 AM - 11:00 AM)",
        actionType: "register",
      },
    ],
  },
  {
    id: "semester3",
    name: "Semester 3",
    modules: [
      {
        id: "module6",
        title: "Artificial Intelligence",
        credits: 30,
        schedule: "Mon, Wed (1:00 PM - 3:00 PM)",
        actionType: "view",
      },
      {
        id: "module7",
        title: "Mobile Application Development",
        credits: 25,
        schedule: "Tue, Thu (10:00 AM - 12:00 PM)",
        actionType: "register",
      },
    ],
  },
  {
    id: "semester4",
    name: "Semester 4",
    modules: [
      {
        id: "module8",
        title: "Final Year Project",
        credits: 60,
        schedule: "Mon, Wed, Fri (1:00 PM - 3:00 PM)",
        actionType: "view",
      },
      {
        id: "module9",
        title: "Machine Learning",
        credits: 30,
        schedule: "Tue, Thu (9:00 AM - 11:00 AM)",
        actionType: "register",
      },
    ],
  },
];

export interface StudentDashboardHomeProps {
  title?: string;
  subtitle?: string;
}
interface JwtPayload {
  userId: string;
  role: string;
  permissions: string[];
  exp: number;
}

const StudentDashboardHome: React.FC<StudentDashboardHomeProps> = () => {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      try {
        const decoded: JwtPayload = jwtDecode(accessToken);
        // console.log(decoded.permissions);
        setPermissions(decoded.permissions || []);
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
        console.error("Failed to fetch users:", err);
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };


  const handleCourseClick = (courseId: string) => {
    setSelectedCourse(courseId === selectedCourse ? null : courseId);
    console.log("Selected Course: "+ courseId);
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
          console.log("J : "+ course),
          <StudentCourseCard
          key={course.id}
          title={course.name}
          duration={course.credits.toString()}
          modules={12}
          isPrimary={true}
          onClick={() => handleCourseClick(course.id)}
          />
        ))}
      </motion.div>
     
      <div className="container mx-auto p-4">
      <ModuleSelection title="Module Selection - Bachelor of Computer Science" semesters={exampleSemesters} />
    </div>
    </div>
  );
};

export default StudentDashboardHome;

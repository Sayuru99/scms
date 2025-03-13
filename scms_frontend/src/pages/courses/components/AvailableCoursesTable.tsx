import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Book, Pencil, Trash2 } from "lucide-react";
import { Course } from "@/lib/api";
import { courseService } from "@/lib/api";
import EditCourseModal from "./EditCourseModal";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AvailableCoursesTableProps {
  courses: Course[];
  roleFilter: string;
  setRoleFilter: (value: string) => void;
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  setFilteredCourses: React.Dispatch<React.SetStateAction<Course[]>>;
}

export default function AvailableCoursesTable({ courses, roleFilter, setRoleFilter, setCourses, setFilteredCourses }: AvailableCoursesTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
   const [editCourse, setEditCourse] = useState<Course | null>(null);
  const coursesPerPage = 5;

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(courses.length / coursesPerPage);

  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));


  const handleDelete = async (courseId: string) => {
    const token = Cookies.get("accessToken");
    if (!token) return;
    try {
      await courseService.deleteCourse(courseId, token);
      setCourses((prev) => prev.filter((u) => u.id !== courseId));
      setFilteredCourses((prev) => prev.filter((u) => u.id !== courseId));
      toast.success("User deleted successfully");
    } catch (err) {
      console.error("Failed to delete user:", err);
      toast.error("Failed to delete user");
    }
  };
  
  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md w-full">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h2 className="text-xl font-semibold">Available courses</h2>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter Courses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Recent">Recent</SelectItem>
          </SelectContent>
        </Select>
      </div>
        
      </div>

      <div className="overflow-x-auto w-full">
        <Table className="w-full table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/4">Course Name</TableHead>
              <TableHead className="w-1/10">Course Code</TableHead>
              <TableHead className="w-1/5">Description</TableHead>
              <TableHead className="w-1/10">Credits</TableHead>
              <TableHead className="w-1/7 text-center"></TableHead>
              <TableHead className="w-1/10 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentCourses.map((course) => (
              <TableRow key={course.id}>
                <TableCell className="font-medium truncate max-w-xs">{course.name}</TableCell>
                <TableCell>{course.code}</TableCell>
                <TableCell>{course.description || "Learn something new today!"}</TableCell>
                <TableCell>{course.credits}</TableCell>
                <TableCell> 
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => {
                        toast.info("Not completed yet!");
                      }}
                    >
                      <Book className="h-4 w-4" /> Manage Modules
                    </Button>
                </TableCell>
                <TableCell className="flex justify-end space-x-1">
                  {/* {permissions.includes("update:courses") && ( */}
                    <Button variant="ghost" size="sm" onClick={() => setEditCourse(course)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  {/* )} */}
                  {/* {permissions.includes("delete:courses") && ( */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action will permanently delete the course {course.name}. This cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(course.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  {/* )} */}
                  {/* {permissions.includes("create:enrollments") && (
                    <Button variant="secondary" onClick={() => onEnroll(course.id)}>
                      Enroll Now
                    </Button>
                  )} */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-between items-center mt-4 px-2">
          <Button 
            onClick={handlePrev} 
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
            className="h-9"
          >
            Previous
          </Button>
          <span className="text-sm">Page {currentPage} of {totalPages}</span>
          <Button 
            onClick={handleNext} 
            disabled={currentPage === totalPages || totalPages === 0}
            variant="outline"
            size="sm"
            className="h-9"
          >
            Next
          </Button>
        </div>
      </div>
      {editCourse && (
        <EditCourseModal
          course={editCourse}
          onClose={() => setEditCourse(null)}
          onCourseUpdated={(updatedCourse) => {
            setCourses((prev) => prev.map((u) => (u.id === updatedCourse.id ? updatedCourse : u)));
            setFilteredCourses((prev) => prev.map((u) => (u.id === updatedCourse.id ? updatedCourse : u)));
          }}
        />
      )}
    </div>
  );
}
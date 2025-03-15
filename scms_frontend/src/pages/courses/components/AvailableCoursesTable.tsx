import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Course } from "@/lib/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil } from "lucide-react";

interface AvailableCoursesTableProps {
  courses: Course[];
  roleFilter: string;
  setRoleFilter: (value: string) => void;
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  setFilteredCourses: React.Dispatch<React.SetStateAction<Course[]>>;
}

export default function AvailableCoursesTable({ courses, roleFilter, setRoleFilter }: AvailableCoursesTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const coursesPerPage = 5;

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(courses.length / coursesPerPage);

  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  
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
              <TableHead className="w-1/10">Action</TableHead>
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
                        navigate(`/courses/manage/${course.id}`);
                      }}
                    >
                      <Pencil className="h-4 w-4" /> Manage
                    </Button>
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
    </div>
  );
}
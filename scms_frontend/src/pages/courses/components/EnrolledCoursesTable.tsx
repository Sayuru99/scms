import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Course {
  id: number;
  code: string;
  name: string;
  description?: string;
  credits: number;
}

interface EnrolledCoursesTableProps {
  courses: Course[];
  permissions: string[];
  onEditCourse: (course: Course) => void;
  onDeleteCourse: (courseId: number) => Promise<void>;
}

export default function EnrolledCoursesTable({
  courses,
  permissions,
  onEditCourse,
  onDeleteCourse,
}: EnrolledCoursesTableProps) {
  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold mb-4">Enrolled Courses</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Credits</TableHead>
            {(permissions.includes("update:courses") ||
              permissions.includes("delete:courses")) && (
              <TableHead>Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course) => (
            <TableRow key={course.id}>
              <TableCell>{course.code}</TableCell>
              <TableCell>{course.name}</TableCell>
              <TableCell>{course.description || "N/A"}</TableCell>
              <TableCell>{course.credits}</TableCell>
              {(permissions.includes("update:courses") ||
                permissions.includes("delete:courses")) && (
                <TableCell>
                  {permissions.includes("update:courses") && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mr-2"
                      onClick={() => onEditCourse(course)}
                    >
                      Edit
                    </Button>
                  )}
                  {permissions.includes("delete:courses") && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDeleteCourse(course.id)}
                    >
                      Delete
                    </Button>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
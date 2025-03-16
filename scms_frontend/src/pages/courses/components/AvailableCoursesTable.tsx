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

interface AvailableCoursesTableProps {
  courses: Course[];
  permissions: string[];
  onEnroll: (courseId: number) => Promise<void>;
}

export default function AvailableCoursesTable({
  courses,
  permissions,
  onEnroll,
}: AvailableCoursesTableProps) {
  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold mb-4">Available Courses</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Credits</TableHead>
            {permissions.includes("create:enrollments") && (
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
              {permissions.includes("create:enrollments") && (
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEnroll(course.id)}
                  >
                    Enroll
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
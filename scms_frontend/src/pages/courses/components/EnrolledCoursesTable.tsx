
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface EnrolledCoursesTableProps {
  courses: any[];
  permissions: string[];
  onEditCourse: (course: any) => void;
  onDeleteCourse: (courseId: number) => void;
}

export default function EnrolledCoursesTable({ courses, permissions, onEditCourse, onDeleteCourse }: EnrolledCoursesTableProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Enrolled Courses</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Credits</TableHead>
              <TableHead>Description</TableHead>
              {permissions.includes("update:courses") && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell>{course.code}</TableCell>
                <TableCell>{course.name}</TableCell>
                <TableCell>{course.credits}</TableCell>
                <TableCell>{course.description || "N/A"}</TableCell>
                {permissions.includes("update:courses") && (
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => onEditCourse(course)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    {permissions.includes("delete:courses") && (
                      <Button variant="ghost" size="sm" onClick={() => onDeleteCourse(course.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
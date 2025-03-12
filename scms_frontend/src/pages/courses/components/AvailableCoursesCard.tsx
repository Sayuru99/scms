// src/pages/courses/components/AvailableCoursesCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AvailableCoursesCardProps {
  courses: any[];
  permissions: string[];
  onEnroll: (courseId: number) => void;
}

export default function AvailableCoursesCard({ courses, permissions, onEnroll }: AvailableCoursesCardProps) {
  return (
    <Card className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <CardHeader>
        <CardTitle>Explore More Courses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {courses.map((course) => (
            <div key={course.id} className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{course.name} ({course.code})</h3>
                <p>{course.description || "Learn something new today!"}</p>
                <p>{course.credits} Credits</p>
              </div>
              {permissions.includes("create:enrollments") && (
                <Button variant="secondary" onClick={() => onEnroll(course.id)}>
                  Enroll Now
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
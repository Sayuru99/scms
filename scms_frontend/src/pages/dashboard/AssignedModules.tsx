import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import type { AssignedModule } from '../../services/lecturerService';
import { Button } from "@/components/ui/button";

// Static data for assigned modules
const staticModules: AssignedModule[] = [
  {
    id: 1,
    code: "CS101",
    name: "Introduction to Programming",
    course: {
      id: 1,
      name: "Computer Science",
      code: "CS"
    },
    semester: "1",
    credits: 3,
    isMandatory: true
  },
  {
    id: 2,
    code: "CS102",
    name: "Data Structures",
    course: {
      id: 1,
      name: "Computer Science",
      code: "CS"
    },
    semester: "2",
    credits: 4,
    isMandatory: true
  },
  {
    id: 3,
    code: "CS201",
    name: "Web Development",
    course: {
      id: 1,
      name: "Computer Science",
      code: "CS"
    },
    semester: "3",
    credits: 3,
    isMandatory: false
  }
];

export default function AssignedModules() {
  const [modules] = useState<AssignedModule[]>(staticModules);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>My Assigned Modules</CardTitle>
      </CardHeader>
      <CardContent>
        {modules.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No modules assigned yet.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Module Code</TableHead>
                <TableHead>Module Name</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {modules.map((module) => (
                <TableRow key={module.id}>
                  <TableCell className="font-medium">{module.code}</TableCell>
                  <TableCell>{module.name}</TableCell>
                  <TableCell>{module.course.name}</TableCell>
                  <TableCell>{module.semester}</TableCell>
                  <TableCell>{module.credits}</TableCell>
                  <TableCell>
                    {module.isMandatory ? 'Mandatory' : 'Optional'}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="default" 
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => console.log(`Schedule class for ${module.code}`)}
                    >
                      Schedule Class
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
} 
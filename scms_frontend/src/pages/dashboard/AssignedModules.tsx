import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { lecturerService } from '../../services/lecturerService';
import { toast } from 'react-toastify';
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
import Cookies from 'js-cookie';
import type { AssignedModule } from '../../services/lecturerService';

export default function AssignedModules() {
  const { userId } = useAuth();
  const [modules, setModules] = useState<AssignedModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssignedModules = async () => {
      if (!userId) return;

      const token = Cookies.get('accessToken');
      if (!token) return;

      try {
        setLoading(true);
        const response = await lecturerService.getAssignedModules(userId, token);
        setModules(response.modules);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch assigned modules');
        toast.error('Failed to fetch assigned modules');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedModules();
  }, [userId]);

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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
} 
import { useState, useEffect } from 'react';
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
import { Module, lecturerService } from '@/lib/api';
import { Button } from "@/components/ui/button";
import { ScheduleModal } from "@/components/modules/ScheduleModal";
import Cookies from "js-cookie";

export default function AssignedModules() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const token = Cookies.get("accessToken");
        if (!token) {
          setError("No authentication token found");
          return;
        }
        const response = await lecturerService.getAssignedModules(token);
        if (response && Array.isArray(response.modules)) {
          setModules(response.modules);
        } else {
          console.error('Unexpected API response:', response);
          setError('Invalid response format from server');
          setModules([]);
        }
      } catch (err) {
        console.error('Error fetching modules:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch modules');
        setModules([]);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  const handleScheduleClick = (module: Module) => {
    setSelectedModule(module);
  };

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
    <>
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
                        onClick={() => handleScheduleClick(module)}
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

      {selectedModule && (
        <ScheduleModal
          isOpen={!!selectedModule}
          onClose={() => setSelectedModule(null)}
          moduleCode={selectedModule.code || ''}
          moduleName={selectedModule.name}
        />
      )}
    </>
  );
} 
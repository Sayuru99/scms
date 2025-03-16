import React, { useState } from 'react';
import { PlusCircle, Save, SendHorizontal } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import Semester from './Semester';
import SemesterDialog from './SemesterDialog';
import ModuleDialog from './ModuleDialog';
import EmptyState from './EmptyState';
import { ModuleType } from './Module';

type SemesterType = {
  id: string;
  name: string;
  modules: ModuleType[];
};

const CourseBuilder: React.FC = () => {
  const { toast } = useToast();
  const [courseTitle, setCourseTitle] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [semesters, setSemesters] = useState<SemesterType[]>([]);
  const [semesterDialogOpen, setSemesterDialogOpen] = useState(false);
  const [moduleDialogOpen, setModuleDialogOpen] = useState(false);
  const [activeSemesterId, setActiveSemesterId] = useState<string | null>(null);

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const handleAddSemester = (name: string) => {
    const newSemester: SemesterType = {
      id: generateId(),
      name,
      modules: []
    };
    
    setSemesters([...semesters, newSemester]);
    
    toast({
      title: "Semester Added",
      description: `${name} has been added to the course.`,
    });
  };

  const handleDeleteSemester = (semesterId: string) => {
    setSemesters(semesters.filter(semester => semester.id !== semesterId));
    
    toast({
      title: "Semester Deleted",
      description: "Semester has been removed from the course.",
    });
  };

  const handleAddModule = (moduleData: {
    title: string;
    code: string;
    credits: number;
    isMandatory: boolean;
  }) => {
    if (!activeSemesterId) return;
    
    const newModule: ModuleType = {
      id: generateId(),
      ...moduleData
    };
    
    setSemesters(semesters.map(semester => {
      if (semester.id === activeSemesterId) {
        return {
          ...semester,
          modules: [...semester.modules, newModule]
        };
      }
      return semester;
    }));
    
    toast({
      title: "Module Added",
      description: `${moduleData.title} has been added to the semester.`,
    });
  };

  const handleDeleteModule = (semesterId: string, moduleId: string) => {
    setSemesters(semesters.map(semester => {
      if (semester.id === semesterId) {
        return {
          ...semester,
          modules: semester.modules.filter(module => module.id !== moduleId)
        };
      }
      return semester;
    }));
    
    toast({
      title: "Module Deleted",
      description: "Module has been removed from the semester.",
    });
  };

  const handleSaveDraft = () => {
    // In a real app, this would save to a backend
    toast({
      title: "Draft Saved",
      description: "Your course has been saved as a draft.",
    });
  };

  const handlePublishCourse = () => {
    // In a real app, this would publish the course
    if (!courseTitle.trim()) {
      toast({
        title: "Validation Error",
        description: "Course title is required.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Course Published",
      description: "Your course has been successfully published.",
    });
  };

  const handleOpenModuleDialog = (semesterId: string) => {
    setActiveSemesterId(semesterId);
    setModuleDialogOpen(true);
  };

  return (
    <div className="w-full max-w-4xl ml-3.5 fade-in text-left">
      <h1 className="text-3xl font-bold mb-8">Course Details</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="space-y-2">
          <Label htmlFor="courseTitle">Course Title</Label>
          <Input
            id="courseTitle"
            placeholder="Enter course title"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="courseCode">Course Code</Label>
          <Input
            id="courseCode"
            placeholder="Enter course code"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
            className="w-full"
          />
        </div>
      </div>
      
      <Separator className="my-8" />
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Semesters & Modules</h2>
          <Button onClick={() => setSemesterDialogOpen(true)}>
            <PlusCircle size={16} className="mr-2" />
            Add New Semester
          </Button>
        </div>
        
        {semesters.length > 0 ? (
          <div className="space-y-6">
            {semesters.map((semester) => (
              <Semester
                key={semester.id}
                id={semester.id}
                name={semester.name}
                modules={semester.modules}
                onAddModule={() => handleOpenModuleDialog(semester.id)}
                onDeleteModule={(moduleId) => handleDeleteModule(semester.id, moduleId)}
                onDeleteSemester={() => handleDeleteSemester(semester.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            message="No semesters added yet. Start by adding a semester to your course."
            buttonText="Add Semester"
            onButtonClick={() => setSemesterDialogOpen(true)}
          />
        )}
      </div>
      
      <div className="mt-12 flex justify-end space-x-4">
        <Button onClick={handlePublishCourse}>
          <SendHorizontal size={16} className="mr-2" />
          Publish Course
        </Button>
      </div>
      
      {/* Dialogs */}
      <SemesterDialog
        open={semesterDialogOpen}
        onOpenChange={setSemesterDialogOpen}
        onAddSemester={handleAddSemester}
      />
      
      <ModuleDialog
        open={moduleDialogOpen}
        onOpenChange={setModuleDialogOpen}
        onAddModule={handleAddModule}
      />
    </div>
  );
};

export default CourseBuilder;
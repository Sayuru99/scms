import React, { useState, useEffect } from 'react';
import { PlusCircle, SendHorizontal, Pencil } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import Cookies from 'js-cookie';
import { useParams, useNavigate } from 'react-router-dom';
import Semester from './Semester';
import SemesterDialog from './SemesterDialog';
import ModuleDialog from './ModuleDialog';
import EmptyState from './EmptyState';
import { ModuleType } from './Module';
import { courseService } from '@/services/courseService';

export type SemesterType = {
  id: string;
  name: string;
  modules: ModuleType[];
};

const CourseBuilder: React.FC = () => {
  const { toast } = useToast();
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [courseTitle, setCourseTitle] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseCredits, setCourseCredits] = useState<number>(0);
  const [semesters, setSemesters] = useState<SemesterType[]>([]);
  const [semesterDialogOpen, setSemesterDialogOpen] = useState(false);
  const [moduleDialogOpen, setModuleDialogOpen] = useState(false);
  const [activeSemesterId, setActiveSemesterId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editingModule, setEditingModule] = useState<ModuleType | null>(null);
  const [editingSemester, setEditingSemester] = useState<SemesterType | null>(null);

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId]);

  const fetchCourseDetails = async () => {
    const token = Cookies.get('accessToken');
    if (!token || !courseId) return;

    setIsLoading(true);
    try {
      const course = await courseService.getCourseById(parseInt(courseId), token);
      setCourseTitle(course.name);
      setCourseCode(course.code);
      setCourseDescription(course.description || '');
      setCourseCredits(course.credits || 0);
      
      // Transform modules into semesters
      const semesterMap = new Map<string, ModuleType[]>();
      course.modules
        .filter((module: { isDeleted: boolean }) => !module.isDeleted)
        .forEach((module: { semester: string; id: number; name: string; code?: string; credits?: number; isMandatory: boolean; lecturer?: { id: string } }) => {
          if (!semesterMap.has(module.semester)) {
            semesterMap.set(module.semester, []);
          }
          semesterMap.get(module.semester)?.push({
            id: module.id.toString(),
            title: module.name,
            code: module.code || '',
            credits: module.credits || 0,
            isMandatory: module.isMandatory,
            lecturerId: module.lecturer?.id
          });
        });

      const transformedSemesters: SemesterType[] = Array.from(semesterMap.entries())
        .map(([name, modules]) => ({
          id: generateId(),
          name,
          modules
        }));

      setSemesters(transformedSemesters);
    } catch (error) {
      console.error('Error fetching course:', error);
      toast({
        title: "Error",
        description: "Failed to load course details",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const handleAddSemester = (name: string) => {
    if (editingSemester) {
      setSemesters(semesters.map(semester => 
        semester.id === editingSemester.id 
          ? { ...semester, name }
          : semester
      ));
      setEditingSemester(null);
      toast({
        title: "Semester Updated",
        description: `${name} has been updated.`,
      });
    } else {
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
    }
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
    lecturerId?: string;
  }) => {
    if (!activeSemesterId) return;
    
    if (editingModule) {
      setSemesters(semesters.map(semester => {
        if (semester.id === activeSemesterId) {
          return {
            ...semester,
            modules: semester.modules.map(module =>
              module.id === editingModule.id
                ? { ...module, ...moduleData }
                : module
            )
          };
        }
        return semester;
      }));
      setEditingModule(null);
      toast({
        title: "Module Updated",
        description: `${moduleData.title} has been updated.`,
      });
    } else {
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
    }
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

  const handleEditModule = (semesterId: string, module: ModuleType) => {
    setActiveSemesterId(semesterId);
    setEditingModule(module);
    setModuleDialogOpen(true);
  };

  const handleEditSemester = (semester: SemesterType) => {
    setEditingSemester(semester);
    setSemesterDialogOpen(true);
  };

  const handlePublishCourse = async () => {
    if (!courseTitle.trim()) {
      toast({
        title: "Validation Error",
        description: "Course title is required.",
        variant: "destructive"
      });
      return;
    }

    if (!courseCode.trim()) {
      toast({
        title: "Validation Error",
        description: "Course code is required.",
        variant: "destructive"
      });
      return;
    }

    if (courseCredits < 0) {
      toast({
        title: "Validation Error",
        description: "Course credits cannot be negative.",
        variant: "destructive"
      });
      return;
    }

    const token = Cookies.get('accessToken');
    if (!token) {
      toast({
        title: "Authentication Error",
        description: "Please log in to create a course.",
        variant: "destructive"
      });
      return;
    }

    try {
      const courseData = {
        name: courseTitle,
        code: courseCode,
        description: courseDescription,
        credits: courseCredits,
        modules: semesters.flatMap(semester => 
          semester.modules.map(module => ({
            name: module.title,
            code: module.code,
            semester: semester.name,
            credits: module.credits,
            isMandatory: module.isMandatory,
            lecturerId: module.lecturerId
          }))
        )
      };

      if (courseId) {
        await courseService.updateCourse(parseInt(courseId), courseData, token);
        toast({
          title: "Success",
          description: "Course has been successfully updated.",
        });
      } else {
        await courseService.createCourse(courseData, token);
        toast({
          title: "Success",
          description: "Course has been successfully published.",
        });
      }

      navigate('/courses');
    } catch (error) {
      console.error('Error saving course:', error);
      let errorMessage = courseId ? "Failed to update the course. " : "Failed to publish the course. ";
      
      if (error instanceof Error) {
        errorMessage += error.message;
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const handleOpenModuleDialog = (semesterId: string) => {
    setActiveSemesterId(semesterId);
    setEditingModule(null);
    setModuleDialogOpen(true);
  };

  return (
    <div className="w-full max-w-4xl ml-3.5 fade-in text-left">
      <h1 className="text-3xl font-bold mb-8">{courseId ? 'Edit Course' : 'Create Course'}</h1>
      
      {isLoading ? (
        <div>Loading course details...</div>
      ) : (
        <>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="space-y-2">
              <Label htmlFor="courseDescription">Course Description</Label>
              <textarea
                id="courseDescription"
                placeholder="Enter course description"
                value={courseDescription}
                onChange={(e) => setCourseDescription(e.target.value)}
                className="w-full min-h-[100px] p-2 border rounded-md"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="courseCredits">Course Credits</Label>
              <Input
                id="courseCredits"
                type="number"
                min="0"
                placeholder="Enter course credits"
                value={courseCredits}
                onChange={(e) => setCourseCredits(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
          
          <Separator className="my-8" />
          
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Semesters & Modules</h2>
              <Button onClick={() => {
                setEditingSemester(null);
                setSemesterDialogOpen(true);
              }}>
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
                    onEditModule={(module) => handleEditModule(semester.id, module)}
                    onEditSemester={() => handleEditSemester(semester)}
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
              {courseId ? 'Update Course' : 'Publish Course'}
            </Button>
          </div>
          
          {/* Dialogs */}
          <SemesterDialog
            open={semesterDialogOpen}
            onOpenChange={setSemesterDialogOpen}
            onAddSemester={handleAddSemester}
            editingSemester={editingSemester}
          />
          
          <ModuleDialog
            open={moduleDialogOpen}
            onOpenChange={setModuleDialogOpen}
            onAddModule={handleAddModule}
            editingModule={editingModule}
          />
        </>
      )}
    </div>
  );
};

export default CourseBuilder;
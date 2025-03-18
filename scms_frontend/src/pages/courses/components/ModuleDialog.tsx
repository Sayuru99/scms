import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ModuleType } from './Module';
import { userService, User } from '@/lib/api';
import Cookies from 'js-cookie';

type ModuleDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddModule: (moduleData: {
    title: string;
    code: string;
    credits: number;
    isMandatory: boolean;
    lecturerId?: string;
  }) => void;
  editingModule: ModuleType | null;
};

const ModuleDialog: React.FC<ModuleDialogProps> = ({ 
  open, 
  onOpenChange,
  onAddModule,
  editingModule
}) => {
  const [moduleData, setModuleData] = useState({
    title: "",
    code: "",
    credits: 3,
    isMandatory: true,
    lecturerId: "none"
  });
  const [lecturers, setLecturers] = useState<User[]>([]);

  useEffect(() => {
    if (editingModule) {
      setModuleData({
        title: editingModule.title,
        code: editingModule.code,
        credits: editingModule.credits,
        isMandatory: editingModule.isMandatory,
        lecturerId: editingModule.lecturerId || "none"
      });
    } else {
      setModuleData({
        title: "",
        code: "",
        credits: 3,
        isMandatory: true,
        lecturerId: "none"
      });
    }
  }, [editingModule]);

  useEffect(() => {
    const fetchLecturers = async () => {
      const token = Cookies.get('accessToken');
      if (!token) return;

      try {
        const users = await userService.getUsers(token);
        const lecturerUsers = users.filter(user => user.role.name === 'Lecturer');
        setLecturers(lecturerUsers);
      } catch (error) {
        console.error('Failed to fetch lecturers:', error);
      }
    };

    if (open) {
      fetchLecturers();
    }
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setModuleData(prev => ({
      ...prev,
      [name]: name === 'credits' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddModule({
      ...moduleData,
      lecturerId: moduleData.lecturerId === "none" ? undefined : moduleData.lecturerId
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {editingModule ? 'Edit Module' : 'Add New Module'}
          </DialogTitle>
          <DialogDescription>
            {editingModule ? 'Update the module details below.' : 'Fill in the module details below.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="title">Module Title</Label>
            <Input
              id="title"
              name="title"
              value={moduleData.title}
              onChange={handleChange}
              placeholder="Enter module title"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="code">Module Code</Label>
            <Input
              id="code"
              name="code"
              value={moduleData.code}
              onChange={handleChange}
              placeholder="Enter module code"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="credits">Credits</Label>
            <Input
              id="credits"
              name="credits"
              type="number"
              value={moduleData.credits}
              onChange={handleChange}
              min="1"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Module Type</Label>
            <RadioGroup
              value={moduleData.isMandatory ? "mandatory" : "optional"}
              onValueChange={(value) => setModuleData(prev => ({
                ...prev,
                isMandatory: value === "mandatory"
              }))}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mandatory" id="mandatory" />
                <Label htmlFor="mandatory">Mandatory</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="optional" id="optional" />
                <Label htmlFor="optional">Optional</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label>Lecturer</Label>
            <Select
              value={moduleData.lecturerId}
              onValueChange={(value) => setModuleData(prev => ({
                ...prev,
                lecturerId: value
              }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a lecturer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Lecturer</SelectItem>
                {lecturers.map((lecturer) => (
                  <SelectItem key={lecturer.id} value={lecturer.id}>
                    {lecturer.firstName} {lecturer.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingModule ? 'Update Module' : 'Add Module'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModuleDialog;
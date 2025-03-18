import React, { useState, useEffect } from 'react';
import { MoreVertical, Pencil, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { userService, User as UserType } from '@/lib/api';
import Cookies from 'js-cookie';

export type ModuleType = {
  id: string;
  title: string;
  code: string;
  credits: number;
  isMandatory: boolean;
  lecturerId?: string | null;
};

type ModuleProps = {
  module: ModuleType;
  onDeleteModule: () => void;
  onEditModule: () => void;
};

const Module: React.FC<ModuleProps> = ({ module, onDeleteModule, onEditModule }) => {
  const [lecturer, setLecturer] = useState<UserType | null>(null);

  useEffect(() => {
    const fetchLecturer = async () => {
      if (!module.lecturerId || module.lecturerId === "none") {
        setLecturer(null);
        return;
      }

      const token = Cookies.get('accessToken');
      if (!token) return;

      try {
        const users = await userService.getUsers(token);
        const lecturerUser = users.find(user => user.id === module.lecturerId);
        if (lecturerUser) {
          setLecturer(lecturerUser);
        }
      } catch (error) {
        console.error('Failed to fetch lecturer:', error);
      }
    };

    fetchLecturer();
  }, [module.lecturerId]);

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
      <div className="flex-1">
        <h4 className="font-medium">{module.title}</h4>
        <p className="text-sm text-gray-500">{module.code}</p>
        <p className="text-sm text-gray-500">{module.credits} credits</p>
        <p className="text-sm text-gray-500">{module.isMandatory ? 'Mandatory' : 'Optional'}</p>
        {lecturer && (
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
            <User className="h-4 w-4" />
            <span>{lecturer.firstName} {lecturer.lastName}</span>
          </div>
        )}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEditModule}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDeleteModule} className="text-red-600">
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Module;
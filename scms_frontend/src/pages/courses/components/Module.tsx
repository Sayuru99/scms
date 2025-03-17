import React from 'react';
import { MoreVertical, Pencil } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type ModuleType = {
  id: string;
  title: string;
  code: string;
  credits: number;
  isMandatory: boolean;
  lecturerId?: string;
};

type ModuleProps = {
  module: ModuleType;
  onDeleteModule: () => void;
  onEditModule: () => void;
};

const Module: React.FC<ModuleProps> = ({ module, onDeleteModule, onEditModule }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
      <div className="flex-1">
        <h4 className="font-medium">{module.title}</h4>
        <p className="text-sm text-gray-500">{module.code}</p>
        <p className="text-sm text-gray-500">{module.credits} credits</p>
        <p className="text-sm text-gray-500">{module.isMandatory ? 'Mandatory' : 'Optional'}</p>
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
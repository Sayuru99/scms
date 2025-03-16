import React from 'react';
import { MoreVertical } from 'lucide-react';
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
};

type ModuleProps = {
  module: ModuleType;
  onDeleteModule: () => void;
};

const Module: React.FC<ModuleProps> = ({ module, onDeleteModule }) => {
  return (
    <div className="module-card fade-in-up">
      <div className="module-header">
        <h4 className="module-title">{module.title}</h4>
        <div className="flex items-center space-x-2">
          <span className={`module-tag ${module.isMandatory ? 'module-tag-mandatory' : 'module-tag-optional'}`}>
            {module.isMandatory ? 'Mandatory' : 'Optional'}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical size={16} />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem className="text-destructive" onClick={onDeleteModule}>
                Delete Module
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="module-details">
        {module.code} • {module.credits} Credit{module.credits !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default Module;
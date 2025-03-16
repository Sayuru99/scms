import React, { useState } from 'react';
import { PlusCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Module, { ModuleType } from './Module';
import EmptyState from './EmptyState';

type SemesterProps = {
  id: string;
  name: string;
  modules: ModuleType[];
  onAddModule: () => void;
  onDeleteModule: (moduleId: string) => void;
  onDeleteSemester: () => void;
};

const Semester: React.FC<SemesterProps> = ({ 
  id, 
  name, 
  modules,
  onAddModule,
  onDeleteModule,
  onDeleteSemester,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="semester-container">
      <div className="semester-header">
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </Button>
          <h3 className="semester-title">{name}</h3>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs h-8 px-3"
            onClick={onDeleteSemester}
          >
            Delete
          </Button>
          <Button 
            size="sm" 
            className="text-xs h-8 px-3"
            onClick={onAddModule}
          >
            <PlusCircle size={14} className="mr-1" />
            Add Module
          </Button>
        </div>
      </div>
      
      {!isCollapsed && (
        <div className="module-container">
          {modules.length > 0 ? (
            <div className="space-y-3">
              {modules.map((module) => (
                <Module 
                  key={module.id} 
                  module={module} 
                  onDeleteModule={() => onDeleteModule(module.id)}
                />
              ))}
            </div>
          ) : (
            <EmptyState 
              message="No modules added yet." 
              buttonText="Add Module" 
              onButtonClick={onAddModule}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Semester;

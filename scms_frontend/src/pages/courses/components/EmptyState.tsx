import React from 'react';
import { Folder } from 'lucide-react';
import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  message: string;
  buttonText: string;
  onButtonClick: () => void;
};

const EmptyState: React.FC<EmptyStateProps> = ({ 
  message, 
  buttonText, 
  onButtonClick 
}) => {
  return (
    <div className="empty-state fade-in py-16">
      <div className="empty-state-icon">
        <Folder size={48} strokeWidth={1.5} />
      </div>
      <p className="empty-state-text">{message}</p>
      <Button onClick={onButtonClick} className="scale-in">
        {buttonText}
      </Button>
    </div>
  );
};

export default EmptyState;
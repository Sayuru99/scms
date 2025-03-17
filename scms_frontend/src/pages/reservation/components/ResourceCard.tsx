import React from 'react';
import { Button } from '@/components/ui/button';

interface ResourceCardProps {
  type: string;
  title: string;
  description: string;
  onReserve: () => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ type, title, description, onReserve }) => {
  const getTagColor = () => {
    switch (type.toLowerCase()) {
      case 'lecture hall':
        return 'bg-blue-100 text-blue-800';
      case 'equipment':
        return 'bg-amber-100 text-amber-800';
      case 'labs':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="resource-card animate-scale-in flex flex-col h-full">
      <div className="flex-grow">
        <div className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getTagColor()} mb-2 inline-block`}> {type} </div>
        <h3 className="resource-title">{title}</h3>
        <p className="resource-description">{description}</p>
      </div>
      <div className="mt-auto pt-4">
        <Button 
          onClick={onReserve} 
          className="reserve-btn w-full"
        >
          Reserve Now
        </Button>
      </div>
    </div>
  );
};

export default ResourceCard;
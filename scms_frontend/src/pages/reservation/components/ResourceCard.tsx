import React from 'react';
import { Button } from '@/components/ui/button';

interface ResourceCardProps {
  type: string;
  title: string;
  description: string;
  onReserve: () => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ type, title, description, onReserve }) => {
  // Predefined color pairs for common resource types
  const predefinedColors: { [key: string]: { bg: string; text: string } } = {
    'lecture hall': { bg: 'bg-blue-100', text: 'text-blue-800' },
    'equipment': { bg: 'bg-amber-100', text: 'text-amber-800' },
    'labs': { bg: 'bg-green-100', text: 'text-green-800' },
    'computer': { bg: 'bg-purple-100', text: 'text-purple-800' },
    'projector': { bg: 'bg-pink-100', text: 'text-pink-800' },
    'whiteboard': { bg: 'bg-indigo-100', text: 'text-indigo-800' },
    'printer': { bg: 'bg-cyan-100', text: 'text-cyan-800' },
    'scanner': { bg: 'bg-teal-100', text: 'text-teal-800' },
    'microscope': { bg: 'bg-orange-100', text: 'text-orange-800' },
    'camera': { bg: 'bg-rose-100', text: 'text-rose-800' }
  };

  // Generate a consistent color based on the resource type name
  const generateColor = (typeName: string) => {
    // Try to find predefined color first
    const predefined = predefinedColors[typeName.toLowerCase()];
    if (predefined) {
      return predefined;
    }

    // If no predefined color, generate one based on the name
    const colors = [
      { bg: 'bg-blue-100', text: 'text-blue-800' },
      { bg: 'bg-amber-100', text: 'text-amber-800' },
      { bg: 'bg-green-100', text: 'text-green-800' },
      { bg: 'bg-purple-100', text: 'text-purple-800' },
      { bg: 'bg-pink-100', text: 'text-pink-800' },
      { bg: 'bg-indigo-100', text: 'text-indigo-800' },
      { bg: 'bg-cyan-100', text: 'text-cyan-800' },
      { bg: 'bg-teal-100', text: 'text-teal-800' },
      { bg: 'bg-orange-100', text: 'text-orange-800' },
      { bg: 'bg-rose-100', text: 'text-rose-800' }
    ];

    // Generate a consistent index based on the type name
    const hash = typeName.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const getTagColor = () => {
    const color = generateColor(type);
    return `${color.bg} ${color.text}`;
  };

  const getCardBgColor = () => {
    const color = generateColor(type);
    // Convert the tag background color to a lighter shade for the card
    return color.bg.replace('100', '50');
  };

  return (
    <div className={`resource-card animate-scale-in flex flex-col h-full ${getCardBgColor()} rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200`}>
      <div className="flex-grow">
        <div className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getTagColor()} mb-2 inline-block`}> {type} </div>
        <h3 className="resource-title font-semibold text-lg mb-2">{title}</h3>
        <p className="resource-description text-gray-600">{description}</p>
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
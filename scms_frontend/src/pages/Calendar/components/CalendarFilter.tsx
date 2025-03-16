import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FILTER_TYPES } from '../../../utils/Calendar';

interface CalendarFilterProps {
  activeFilters: string[];
  onFilterChange: (type: string) => void;
}

const CalendarFilter: React.FC<CalendarFilterProps> = ({ 
  activeFilters, 
  onFilterChange 
}) => {
  return (
    <div className="calendar-filter mb-4 mt-4 border border-border rounded-md p-4 bg-card">
      <h3 className="text-md font-medium mb-3">Filter Events</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {FILTER_TYPES.map((type) => (
          <div key={type.value} className="flex items-center space-x-2">
            <Checkbox 
              id={`filter-${type.value}`} 
              checked={activeFilters.includes(type.value)}
              onCheckedChange={() => onFilterChange(type.value)}
              className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
            />
            <Label 
              htmlFor={`filter-${type.value}`}
              className="flex items-center cursor-pointer text-sm font-normal"
            >
              <span className={`mr-2 inline-block w-3 h-3 rounded-full ${type.dotClass}`}></span>
              {type.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarFilter;
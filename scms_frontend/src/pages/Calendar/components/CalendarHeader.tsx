import React from 'react';
import { Button } from '@/components/ui/button';
import { MONTHS } from '../../../utils/Calendar';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Plus 
} from 'lucide-react';
import type { CalendarView } from '../../../utils/Calendar';

interface CalendarHeaderProps {
  currentDate: Date;
  view: CalendarView;
  onPrevious: () => void;
  onNext: () => void;
  onViewChange: (view: CalendarView) => void;
  onTodayClick: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  view,
  onPrevious,
  onNext,
  onViewChange,
  onTodayClick,
}) => {
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  return (
    <div className="calendar-header">
      <div className="flex items-center">
        <h2 className="text-xl font-semibold mr-4">
          {MONTHS[month]} {year}
        </h2>
        <div className="flex space-x-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onPrevious}
            className="h-8 w-8 rounded-full text-muted-foreground"
          >
            <ChevronLeft size={18} />
            <span className="sr-only">Previous</span>
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onNext}
            className="h-8 w-8 rounded-full text-muted-foreground"
          >
            <ChevronRight size={18} />
            <span className="sr-only">Next</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onTodayClick}
            className="ml-2 h-8 text-xs"
          >
            today
          </Button>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <div className="flex bg-muted rounded-md p-1">
          <Button 
            variant={view === "month" ? "default" : "ghost"} 
            size="sm"
            className="h-8 rounded-sm text-xs"
            onClick={() => onViewChange("month")}
          >
            month
          </Button>
          <Button 
            variant={view === "week" ? "default" : "ghost"} 
            size="sm"
            className="h-8 rounded-sm text-xs"
            onClick={() => onViewChange("week")}
          >
            week
          </Button>
          <Button 
            variant={view === "day" ? "default" : "ghost"} 
            size="sm"
            className="h-8 rounded-sm text-xs"
            onClick={() => onViewChange("day")}
          >
            day
          </Button>
          <Button 
            variant={view === "list" ? "default" : "ghost"} 
            size="sm"
            className="h-8 rounded-sm text-xs"
            onClick={() => onViewChange("list")}
          >
            list
          </Button>
        </div>
        <Button 
          size="sm" 
          className="h-8 gap-1"
        >
          <Plus size={16} />
          <span>New event</span>
        </Button>
      </div>
    </div>
  );
};

export default CalendarHeader;
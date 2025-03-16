import React from 'react';
import { DAYS_OF_WEEK, getCalendarDays, getEventsForDay } from '../../../utils/Calendar';
import { Event, getEventTypeColor } from '../../../data/events';
import CalendarEvent from './CalendarEvent';

interface CalendarGridProps {
  currentDate: Date;
  events: Event[];
  onEventClick: (event: Event) => void;
  activeFilters?: string[];
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ 
  currentDate, 
  events, 
  onEventClick,
  activeFilters = []
}) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();
  
  const days = getCalendarDays(year, month);
  
  return (
    <div>
      <div className="grid grid-cols-7 border-b border-border">
        {DAYS_OF_WEEK.map((day) => (
          <div key={day} className="calendar-day-header">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 auto-rows-fr">
        {days.map((day, index) => {
          const isToday = 
            day.getDate() === today.getDate() && 
            day.getMonth() === today.getMonth() && 
            day.getFullYear() === today.getFullYear();
            
          const isCurrentMonth = day.getMonth() === month;
          
          const dayEvents = getEventsForDay(events, day, activeFilters);
          
          return (
            <div 
              key={index} 
              className={`calendar-day relative ${!isCurrentMonth ? 'bg-secondary/30' : ''}`}
            >
              <div className={`calendar-day-number ${isToday ? 'bg-primary text-primary-foreground w-7 h-7 rounded-full flex items-center justify-center mx-auto' : ''} ${!isCurrentMonth ? 'text-muted-foreground/60' : ''}`}>
                {day.getDate()}
              </div>
              <div className="mt-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <CalendarEvent 
                    key={event.id} 
                    event={event} 
                    onClick={onEventClick}
                    className={getEventTypeColor(event.type)}
                  />
                ))}
                {dayEvents.length > 3 && (
                  <button 
                    className="text-xs text-muted-foreground hover:text-foreground mt-1 transition-colors"
                    onClick={() => {
                      // For now, we'll just open the first hidden event
                      onEventClick(dayEvents[3]);
                    }}
                  >
                    + {dayEvents.length - 3} more
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;
import React from 'react';
import { Event, getEventTypeDot } from '../../../data/events';

interface CalendarEventProps {
  event: Event;
  onClick: (event: Event) => void;
  className?: string;
}

const CalendarEvent: React.FC<CalendarEventProps> = ({ event, onClick, className = '' }) => {
  return (
    <div
      className={`calendar-event ${className}`}
      onClick={() => onClick(event)}
    >
      <span className={`calendar-event-dot ${getEventTypeDot(event.type)}`}></span>
      <span className="font-medium">{event.title}</span>
    </div>
  );
};

export default CalendarEvent;
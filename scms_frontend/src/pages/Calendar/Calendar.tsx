import React, { useState, useEffect } from 'react';
import CalendarHeader from './components/CalendarHeader';
import CalendarGrid from './components/CalendarGrid';
import CalendarFilter from './components/CalendarFilter';
import EventDetailsModal from './components/EventDetailsModal';
import { events } from '../../data/events';
import type { Event } from '../../data/events';
import type { CalendarView } from '../../utils/Calendar';
import { apiRequest } from '@/lib/api';
import Cookies from 'js-cookie';

interface ClassSchedule {
  id: string;
  startTime: string;
  endTime: string;
  location: string | null;
  capacity: number;
  module: {
    name: string;
    code: string;
    lecturer?: {
      firstName: string;
      lastName: string;
    };
  };
}

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 2, 1)); // March 2025
  const [view, setView] = useState<CalendarView>('month');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllEvents();
  }, []);

  const fetchAllEvents = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("accessToken");
      if (!token) {
        console.error("No authentication token found");
        return;
      }

      // Fetch all class schedules
      const schedules = await apiRequest<ClassSchedule[]>(
        '/api/courses/schedules',
        'GET',
        undefined,
        token
      );

      // Transform class schedules into events
      const classEvents: Event[] = schedules.map(schedule => ({
        id: schedule.id,
        title: `${schedule.module.code} - ${schedule.module.name}`,
        date: new Date(schedule.startTime),
        endDate: new Date(schedule.endTime),
        location: schedule.location || undefined,
        details: `Capacity: ${schedule.capacity}${schedule.module.lecturer ? ` | Lecturer: ${schedule.module.lecturer.firstName} ${schedule.module.lecturer.lastName}` : ''}`,
        type: 'Academic Schedule',
        allDay: false,
        participants: schedule.capacity
      }));

      // Combine class events with regular events
      setAllEvents([...events, ...classEvents]);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else if (view === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else if (view === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleViewChange = (newView: CalendarView) => {
    setView(newView);
  };

  const handleTodayClick = () => {
    // For demo purposes, keep the date as March 2025
    setCurrentDate(new Date(2025, 2, 1));
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  const handleFilterChange = (type: string) => {
    setActiveFilters(prev => {
      // If type is already in the filters, remove it
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      }
      // Otherwise add it
      return [...prev, type];
    });
  };

  // Determine what to render based on the current view
  let calendarContent;
  switch (view) {
    case 'month':
      calendarContent = (
        <CalendarGrid 
          currentDate={currentDate} 
          events={allEvents} 
          onEventClick={handleEventClick} 
          activeFilters={activeFilters}
        />
      );
      break;
    case 'week':
      calendarContent = (
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Week view coming soon</p>
        </div>
      );
      break;
    case 'day':
      calendarContent = (
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Day view coming soon</p>
        </div>
      );
      break;
    case 'list':
      calendarContent = (
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">List view coming soon</p>
        </div>
      );
      break;
    default:
      calendarContent = null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="calendar-container overflow-hidden">
      <CalendarHeader 
        currentDate={currentDate}
        view={view}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onViewChange={handleViewChange}
        onTodayClick={handleTodayClick}
      />
      <CalendarFilter 
        activeFilters={activeFilters} 
        onFilterChange={handleFilterChange} 
      />
      <div className="calendar-content animate-fade-in">
        {calendarContent}
      </div>
      
      <EventDetailsModal 
        event={selectedEvent} 
        isOpen={!!selectedEvent} 
        onClose={handleCloseModal} 
      />
    </div>
  );
};

export default Calendar;
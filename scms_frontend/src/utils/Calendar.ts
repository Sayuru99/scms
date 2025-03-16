import { Event } from "../data/events";

export type CalendarView = "month" | "week" | "day" | "list";

export const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const FILTER_TYPES = [
  { value: 'Academic Schedule', label: 'Academic Schedule', dotClass: 'bg-event-red' },
//   { value: 'design', label: 'Design', dotClass: 'bg-event-red' },
  { value: 'events', label: 'Events', dotClass: 'bg-event-amber' },
//   { value: 'photography', label: 'Photography', dotClass: 'bg-event-blue' },
//   { value: 'graphic-design', label: 'Graphic Design', dotClass: 'bg-event-purple' },
//   { value: 'art', label: 'Art', dotClass: 'bg-event-blue' },
];

export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

export const getPreviousMonthDays = (year: number, month: number): Date[] => {
  const firstDayOfMonth = getFirstDayOfMonth(year, month);
  const previousMonth = month - 1 < 0 ? 11 : month - 1;
  const previousMonthYear = month - 1 < 0 ? year - 1 : year;
  const daysInPreviousMonth = getDaysInMonth(previousMonthYear, previousMonth);
  
  const days: Date[] = [];
  
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    days.push(new Date(previousMonthYear, previousMonth, daysInPreviousMonth - i));
  }
  
  return days;
};

export const getNextMonthDays = (year: number, month: number, totalCells: number): Date[] => {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);
  const remainingCells = totalCells - daysInMonth - firstDayOfMonth;
  
  const nextMonth = month + 1 > 11 ? 0 : month + 1;
  const nextMonthYear = month + 1 > 11 ? year + 1 : year;
  
  const days: Date[] = [];
  
  for (let i = 1; i <= remainingCells; i++) {
    days.push(new Date(nextMonthYear, nextMonth, i));
  }
  
  return days;
};

export const getCurrentMonthDays = (year: number, month: number): Date[] => {
  const daysInMonth = getDaysInMonth(year, month);
  const days: Date[] = [];
  
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }
  
  return days;
};

export const getCalendarDays = (year: number, month: number): Date[] => {
  const previousMonthDays = getPreviousMonthDays(year, month);
  const currentMonthDays = getCurrentMonthDays(year, month);
  const totalCells = 42; // 6 rows * 7 columns
  const nextMonthDays = getNextMonthDays(
    year,
    month,
    totalCells - previousMonthDays.length - currentMonthDays.length
  );
  
  return [...previousMonthDays, ...currentMonthDays, ...nextMonthDays];
};

export const formatEventTime = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const getEventsForDay = (events: Event[], day: Date, activeFilters?: string[]): Event[] => {
  const dayEvents = events.filter((event) => isSameDay(event.date, day));
  
  if (!activeFilters || activeFilters.length === 0) {
    return dayEvents;
  }
  
  return dayEvents.filter((event) => activeFilters.includes(event.type));
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString([], {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

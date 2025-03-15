export interface Event {
    id: string;
    title: string;
    date: Date;
    endDate?: Date;
    location?: string;
    details?: string;
    type: 'Academic Schedule' | 'events';
    allDay?: boolean;
    participants?: number;
    online?: boolean;
    platform?: string;
  }
  
  export const events: Event[] = [
    {
      id: '1',
      title: 'Digital Art Showcase',
      date: new Date(2025, 2, 8, 10, 0), // March 8, 2025
      endDate: new Date(2025, 2, 8, 16, 0),
      location: 'Art Gallery - New York',
      details: 'Explore innovative digital creations from artists around the world featuring cutting-edge techniques and styles.',
      type: 'Academic Schedule',
      allDay: false,
      participants: 150,
      online: false
    },
    {
      id: '2',
      title: 'Web Dev Bootcamp',
      date: new Date(2025, 2, 11, 9, 0), // March 11, 2025
      endDate: new Date(2025, 2, 11, 17, 0),
      location: 'Tech Hub - San Francisco',
      details: 'An intensive day of web development learning covering HTML, CSS, and JavaScript fundamentals for beginners.',
      type: 'Academic Schedule',
      allDay: true,
      participants: 45,
      online: false
    },
    {
      id: '3',
      title: 'JavaScript Workshop',
      date: new Date(2025, 2, 12, 14, 0), // March 12, 2025
      endDate: new Date(2025, 2, 12, 17, 0),
      location: 'London',
      details: 'Join our intensive web development bootcamp and master HTML, CSS, and JavaScript in just one week!',
      type: 'events',
      allDay: true,
      participants: 9,
      online: true,
      platform: 'Google Meet'
    },
    {
      id: '4',
      title: 'UI/UX Design Sprint',
      date: new Date(2025, 2, 12, 10, 0), // March 12, 2025
      endDate: new Date(2025, 2, 12, 15, 30),
      location: 'Design Studio - Berlin',
      details: 'A collaborative design sprint to create user-centered interfaces and solve complex UX challenges.',
      type: 'Academic Schedule',
      allDay: false,
      participants: 24,
      online: false
    },
    {
      id: '5',
      title: 'Web Dev Bootcamp',
      date: new Date(2025, 2, 14, 9, 0), // March 14, 2025
      endDate: new Date(2025, 2, 14, 17, 0),
      location: 'Online',
      details: 'Continue your web development journey with advanced topics including responsive design and modern frameworks.',
      type: 'Academic Schedule',
      allDay: true,
      participants: 60,
      online: true,
      platform: 'Zoom'
    },
    {
      id: '6',
      title: 'Photography Masterclass',
      date: new Date(2025, 2, 16, 11, 0), // March 16, 2025
      endDate: new Date(2025, 2, 16, 16, 0),
      location: 'Central Park - New York',
      details: 'Learn professional photography techniques from renowned photographers in this hands-on outdoor masterclass.',
      type: 'events',
      allDay: false,
      participants: 12,
      online: false
    },
    {
      id: '7',
      title: 'Graphic Design Workshop',
      date: new Date(2025, 2, 20, 13, 0), // March 20, 2025
      endDate: new Date(2025, 2, 20, 17, 0),
      location: 'Creative Hub - Toronto',
      details: 'Master the fundamentals of graphic design including typography, color theory, and composition.',
      type: 'events',
      allDay: false,
      participants: 18,
      online: false
    }
  ];
  
  export const getEventTypeColor = (type: Event['type']): string => {
    switch (type) {
      case 'Academic Schedule':
        return 'bg-event-red/10 text-event-red border border-event-red/20';
      case 'events':
        return 'bg-event-amber/10 text-event-amber border border-event-amber/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };
  
  export const getEventTypeDot = (type: Event['type']): string => {
    switch (type) {
      case 'Academic Schedule':
        return 'bg-event-red';
      case 'events':
        return 'bg-event-amber';
      default:
        return 'bg-muted-foreground';
    }
  };
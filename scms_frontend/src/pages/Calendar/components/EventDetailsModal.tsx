import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Event } from '../../../data/events';
import { X, Calendar, MapPin, Users, Globe } from 'lucide-react';
import { formatDate, formatEventTime } from '../../../utils/Calendar';

interface EventDetailsModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ event, isOpen, onClose }) => {
  if (!event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{event.title}</span>
            <DialogClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 pt-2 space-y-6">
          <div className="grid gap-4">
            <div className="flex items-start gap-3">
              <Calendar size={20} className="text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">{formatDate(event.date)}</p>
                {!event.allDay && event.endDate && (
                  <p className="text-sm text-muted-foreground">
                    {formatEventTime(event.date)} - {formatEventTime(event.endDate)}
                  </p>
                )}
                {event.allDay && (
                  <p className="text-sm text-muted-foreground">All day</p>
                )}
              </div>
            </div>
            
            {event.location && (
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-muted-foreground mt-0.5" />
                <p>{event.location}</p>
              </div>
            )}
            
            {event.participants && (
              <div className="flex items-start gap-3">
                <Users size={20} className="text-muted-foreground mt-0.5" />
                <p>Capacity: {event.participants} participants</p>
              </div>
            )}
            
            {event.online && (
              <div className="flex items-start gap-3">
                <Globe size={20} className="text-muted-foreground mt-0.5" />
                <div>
                  <p>Online Event</p>
                  {event.platform && (
                    <p className="text-sm text-muted-foreground">Platform: {event.platform}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {event.details && (
            <div className="space-y-2">
              <h3 className="font-medium">Details</h3>
              <p className="text-sm text-muted-foreground">{event.details}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailsModal; 
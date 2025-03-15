import React, { useEffect } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Event } from '../../../data/events';
import { X, Calendar, MapPin, Users, Globe, Clock } from 'lucide-react';
import { formatDate, formatEventTime } from '../../../utils/Calendar';

interface EventDetailsModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ event, isOpen, onClose }) => {
  // Prevent scrolling of background content when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px] rounded-lg p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">{event.title}</DialogTitle>
            <DialogClose asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full" 
                onClick={onClose}
              >
                <X size={18} />
                <span className="sr-only">Close</span>
              </Button>
            </DialogClose>
          </div>
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
                <div className="flex flex-col">
                  <p>Participants</p>
                  <div className="flex items-center mt-1">
                    <div className="flex -space-x-2 mr-2">
                      {[...Array(Math.min(3, event.participants))].map((_, i) => (
                        <div key={i} className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs border border-background">
                          {i + 1}
                        </div>
                      ))}
                    </div>
                    {event.participants > 3 && (
                      <span className="text-sm text-muted-foreground">+{event.participants - 3} more</span>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {event.online && (
              <div className="flex items-start gap-3">
                <Globe size={20} className="text-muted-foreground mt-0.5" />
                <div>
                  <p>Online</p>
                  {event.platform && (
                    <p className="text-sm text-muted-foreground">{event.platform}</p>
                  )}
                </div>
              </div>
            )}
            
            {event.details && (
              <div className="border-t pt-4 mt-2">
                <h3 className="font-medium mb-2">Details</h3>
                <p className="text-muted-foreground">{event.details}</p>
              </div>
            )}
          </div>
          
          <div className="flex justify-between pt-4">
            <Button 
              variant="outline" 
              onClick={onClose}
            >
              Close
            </Button>
            <div className="space-x-2">
              <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/10">
                <span>Delete</span>
              </Button>
              <Button>
                <span>Edit</span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailsModal;
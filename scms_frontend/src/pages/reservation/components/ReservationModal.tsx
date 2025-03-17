import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { resourceService } from '@/lib/api';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  resourceId: number;
  resourceName: string;
  onReservationComplete: () => void;
}

interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  isBooked?: boolean;
}

interface Reservation {
  startTime: string;
  endTime: string;
}

const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  resourceId,
  resourceName,
  onReservationComplete,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [purpose, setPurpose] = useState<string>('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [existingReservations, setExistingReservations] = useState<Reservation[]>([]);

  // Generate time slots for the selected date
  const generateTimeSlots = (date: string) => {
    const slots: TimeSlot[] = [];
    const startHour = 8; // 8 AM
    const endHour = 18; // 6 PM
    const interval = 1; // 1 hour intervals

    for (let hour = startHour; hour < endHour; hour += interval) {
      const startTime = new Date(date);
      startTime.setHours(hour, 0, 0, 0);
      const endTime = new Date(date);
      endTime.setHours(hour + interval, 0, 0, 0);

      // Check if this slot overlaps with any existing reservation
      const overlappingReservation = existingReservations.find(reservation => {
        const reservationStart = new Date(reservation.startTime);
        const reservationEnd = new Date(reservation.endTime);
        return (
          (startTime >= reservationStart && startTime < reservationEnd) ||
          (endTime > reservationStart && endTime <= reservationEnd) ||
          (startTime <= reservationStart && endTime >= reservationEnd)
        );
      });

      slots.push({
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        isAvailable: !overlappingReservation,
        isBooked: !!overlappingReservation,
      });
    }

    return slots;
  };

  // Fetch existing reservations for the selected date and specific resource
  const fetchExistingReservations = async (date: string) => {
    try {
      const token = Cookies.get('accessToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await resourceService.getReservations(token);
      const dateStart = new Date(date);
      dateStart.setHours(0, 0, 0, 0);
      const dateEnd = new Date(date);
      dateEnd.setHours(23, 59, 59, 999);

      // Filter reservations for the specific resource and date
      const reservationsForDate = response.reservations.filter(reservation => {
        const reservationDate = new Date(reservation.startTime);
        return reservationDate >= dateStart && 
               reservationDate <= dateEnd && 
               reservation.resource.id === resourceId;
      });

      setExistingReservations(reservationsForDate);
      return reservationsForDate;
    } catch (err) {
      console.error('Failed to fetch existing reservations:', err);
      toast.error('Failed to load existing reservations');
      return [];
    }
  };

  // Handle date selection
  const handleDateSelect = async (date: string) => {
    setSelectedDate(date);
    setStartTime('');
    setEndTime('');
    const reservations = await fetchExistingReservations(date);
    const slots = generateTimeSlots(date);
    setTimeSlots(slots);
  };

  const handleReserve = async () => {
    if (!startTime || !endTime || !purpose) {
      toast.error('Please select start time, end time, and provide a purpose');
      return;
    }

    if (new Date(startTime) >= new Date(endTime)) {
      toast.error('End time must be after start time');
      return;
    }

    setLoading(true);
    try {
      const token = Cookies.get('accessToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      await resourceService.createReservation(
        {
          resourceId,
          startTime,
          endTime,
          purpose,
        },
        token
      );

      toast.success('Resource reserved successfully');
      onReservationComplete();
      onClose();
    } catch (err) {
      console.error('Failed to reserve resource:', err);
      toast.error('Failed to reserve resource');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]" aria-describedby="reservation-description">
        <DialogHeader>
          <DialogTitle>Reserve {resourceName}</DialogTitle>
        </DialogHeader>
        <div id="reservation-description" className="sr-only">
          Select a date and time to reserve {resourceName}. Booked time slots are shown in red and cannot be selected.
        </div>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="date">Select Date</Label>
            <Input
              id="date"
              type="date"
              value={selectedDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleDateSelect(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {selectedDate && (
            <div className="grid gap-2">
              <Label>Select Time Range</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">Start Time</Label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {timeSlots.map((slot, index) => (
                      <Button
                        key={index}
                        variant={slot.isBooked ? "destructive" : startTime === slot.startTime ? "default" : "outline"}
                        onClick={() => setStartTime(slot.startTime)}
                        disabled={!slot.isAvailable}
                        className={`text-sm ${
                          slot.isBooked 
                            ? 'bg-red-100 text-red-800 hover:bg-red-200 cursor-not-allowed border-red-200' 
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {formatTime(slot.startTime)}
                        {slot.isBooked && <span className="ml-1 text-xs">(Booked)</span>}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-sm">End Time</Label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {timeSlots.map((slot, index) => (
                      <Button
                        key={index}
                        variant={slot.isBooked ? "destructive" : endTime === slot.endTime ? "default" : "outline"}
                        onClick={() => setEndTime(slot.endTime)}
                        disabled={!slot.isAvailable || (startTime && new Date(slot.endTime) <= new Date(startTime))}
                        className={`text-sm ${
                          slot.isBooked 
                            ? 'bg-red-100 text-red-800 hover:bg-red-200 cursor-not-allowed border-red-200' 
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {formatTime(slot.endTime)}
                        {slot.isBooked && <span className="ml-1 text-xs">(Booked)</span>}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2 text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-100 rounded border border-red-200"></div>
                  <span className="text-red-800">Booked</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-white border rounded"></div>
                  <span>Available</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {startTime && endTime && (
                  <span>
                    Selected: {formatTime(startTime)} - {formatTime(endTime)}
                  </span>
                )}
              </p>
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="purpose">Purpose</Label>
            <Textarea
              id="purpose"
              value={purpose}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPurpose(e.target.value)}
              placeholder="Enter the purpose of your reservation"
            />
          </div>

          <Button
            onClick={handleReserve}
            disabled={loading || !startTime || !endTime || !purpose}
            className="mt-4"
          >
            {loading ? 'Reserving...' : 'Confirm Reservation'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReservationModal; 
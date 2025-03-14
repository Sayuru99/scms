import React from 'react';
import { X, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';

interface Reservation {
  id: string;
  resource: string;
  type: string;
  date: string;
  time: string;
  status: 'Active' | 'Upcoming';
}

const ReservationsTable: React.FC = () => {
  // Sample data
  const reservations: Reservation[] = [
    {
      id: '1',
      resource: 'Laptop 32',
      type: 'Equipment',
      date: 'Jan 15, 2025',
      time: '09:00 - 11:00',
      status: 'Active',
    },
    {
      id: '2',
      resource: 'Hall A-101',
      type: 'Lecture Hall',
      date: 'Jan 15, 2025',
      time: '09:00 - 11:00',
      status: 'Active',
    },
    {
      id: '3',
      resource: 'Computer Lab C2',
      type: 'Labs',
      date: 'Jan 16, 2025',
      time: '09:00 - 11:00',
      status: 'Active',
    },
  ];

  const handleCancel = (reservation: Reservation) => {
    toast.error(`Cancelled reservation for ${reservation.resource}`, {
      description: 'Your reservation has been cancelled.',
    });
  };

  const handleExtend = (reservation: Reservation) => {
    toast.success(`Extended reservation for ${reservation.resource}`, {
      description: 'Your reservation has been extended by 1 hour.',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold">Active & Upcoming Reservations</h2>
      
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="reservation-table">
          <thead>
            <tr>
              <th className="reservation-th rounded-tl-lg">Resource</th>
              <th className="reservation-th">Type</th>
              <th className="reservation-th">Date</th>
              <th className="reservation-th">Time</th>
              <th className="reservation-th">Status</th>
              <th className="reservation-th rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation.id} className="animate-slide-in">
                <td className="reservation-td font-medium">{reservation.resource}</td>
                <td className="reservation-td">{reservation.type}</td>
                <td className="reservation-td">{reservation.date}</td>
                <td className="reservation-td">{reservation.time}</td>
                <td className="reservation-td">
                  <span className="status-active">{reservation.status}</span>
                </td>
                <td className="reservation-td">
                  <div className="flex items-center">
                    <button
                      onClick={() => handleCancel(reservation)}
                      className="action-btn-cancel"
                      aria-label="Cancel reservation"
                    >
                      <X size={18} className="mr-1" />
                      <span>Cancel</span>
                    </button>
                    <button
                      onClick={() => handleExtend(reservation)}
                      className="action-btn-extend"
                      aria-label="Extend reservation"
                    >
                      <ArrowRight size={18} className="mr-1" />
                      <span>Extend</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReservationsTable;

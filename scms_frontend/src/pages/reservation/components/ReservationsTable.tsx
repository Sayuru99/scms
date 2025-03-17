import React, { useEffect, useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';
import { resourceService, type Reservation } from '../../../lib/api';
import { Spinner } from '../../../components/ui/Spinner';
import Cookies from "js-cookie";

const ReservationsTable: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      const accessToken = Cookies.get("accessToken");
      if (!accessToken) return;

      try {
        const response = await resourceService.getReservationsByID(accessToken);
        console.log('Full reservation data:', JSON.stringify(response.reservations, null, 2));
        setReservations(response.reservations);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch reservations';
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handleCancel = async (reservation: Reservation) => {
    const accessToken = Cookies.get("accessToken");
    if (!accessToken) return;

    try {
      await resourceService.cancelReservation(
        reservation.id,
        accessToken
      );
      toast.success('Reservation cancelled successfully');
      const response = await resourceService.getReservationsByID(accessToken);
      setReservations(response.reservations);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to cancel reservation';
      toast.error(message);
    }
  };

  const handleExtend = async (reservation: Reservation) => {
    const accessToken = Cookies.get("accessToken");
    if (!accessToken) return;

    try {
      const extendedEndTime = new Date(reservation.endTime);
      extendedEndTime.setHours(extendedEndTime.getHours() + 1);
      
      await resourceService.updateReservation(
        reservation.id,
        'Approved',
        accessToken
      );
      toast.success('Reservation extended successfully');
      const response = await resourceService.getReservationsByID(accessToken);
      setReservations(response.reservations);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to extend reservation';
      toast.error(message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  const activeReservations = reservations.filter(
    (r) => !r.isDeleted && r.status !== 'Rejected' && r.status !== 'Cancelled'
  );

  // console.log('activeReservations:', activeReservations);

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold">Active & Upcoming Reservations</h2>
      
      {activeReservations.length === 0 ? (
        <div className="text-center text-gray-500 p-4">
          No active reservations found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="reservation-table">
            <thead>
              <tr>
                <th className="reservation-th rounded-tl-lg">Resource</th>
                <th className="reservation-th">Start Time</th>
                <th className="reservation-th">End Time</th>
                <th className="reservation-th rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {activeReservations.map((reservation) => (
                <tr key={reservation.id} className="animate-slide-in">
                  <td className="reservation-td font-medium">
                    {reservation.resource?.name || 'N/A'}
                  </td>
                  <td className="reservation-td">
                    {new Date(reservation.startTime).toLocaleString()}
                  </td>
                  <td className="reservation-td">
                    {new Date(reservation.endTime).toLocaleString()}
                  </td>
                  <td className="reservation-td">
                    <div className="flex items-center">
                      {(reservation.resource?.name?.toLowerCase().includes('laptop') || 
                        reservation.resource?.name?.toLowerCase().includes('equipment')) && (
                        <button
                          onClick={() => handleCancel(reservation)}
                          className="action-btn-cancel"
                          aria-label="Cancel reservation"
                          disabled={!reservation.resource || reservation.status === 'Rejected' || reservation.status === 'Cancelled'}
                        >
                          <X size={18} className="mr-1" />
                          <span>Cancel</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReservationsTable;

// src/pages/resources/components/ReservationTable.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Book, CheckCircle, XCircle } from "lucide-react";
import { toast } from "react-toastify";

interface ReservationTableProps {
  reservations: any[];
  permissions: string[];
  onApproveReject: (reservationId: number, status: "Approved" | "Rejected") => void;
  onReturnResource: (resourceId: number) => void;
}

export default function ReservationTable({ reservations, permissions, onApproveReject, onReturnResource }: ReservationTableProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Reserved Resources</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User Id</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell>{`${reservation.user.firstName} ${reservation.user.lastName}`}</TableCell>
                <TableCell>{reservation.resource.name}</TableCell>
                <TableCell>{new Date(reservation.startTime).toLocaleString()}</TableCell>
                <TableCell>{new Date(reservation.endTime).toLocaleString()}</TableCell>
                <TableCell>
                <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        toast.info("Not completed yet!");
                      }}
                    >
                      <Book className="h-4 w-4" /> Return
                </Button>                  
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
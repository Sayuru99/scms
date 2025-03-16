
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, XCircle } from "lucide-react";

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
        <CardTitle>Recent Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
              <TableHead>Status</TableHead>
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
                <TableCell>{reservation.status}</TableCell>
                <TableCell>
                  {reservation.status === "Requested" && permissions.includes("update:reservations") && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onApproveReject(reservation.id, "Approved")}
                        className="mr-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onApproveReject(reservation.id, "Rejected")}
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                  {reservation.status === "Approved" && permissions.includes("update:reservations") && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onReturnResource(reservation.resource.id)}
                    >
                      Return
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface UpcomingExamsTableProps {
  exams: any[];
}

export default function UpcomingExamsTable({ exams }: UpcomingExamsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Exams</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Exam Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Course</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exams.map((exam) => (
              <TableRow key={exam.id}>
                <TableCell>{exam.name}</TableCell>
                <TableCell>{new Date(exam.date).toLocaleString()}</TableCell>
                <TableCell>{exam.course}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
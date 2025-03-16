import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Exam {
  id: number;
  name: string;
  date: string;
  course: string;
}

interface UpcomingExamsTableProps {
  exams: Exam[];
}

export default function UpcomingExamsTable({ exams }: UpcomingExamsTableProps) {
  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold mb-4">Upcoming Exams</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
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
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ResourceCardsProps {
  resources: any[];
  reservations: any[];
  totalResources: number;
}

export default function ResourceCards({ resources, reservations, totalResources }: ResourceCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card>
        <CardHeader>
          <CardTitle>Total Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{totalResources}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Pending Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {reservations.filter((r) => r.status === "Requested").length}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Reserved Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {resources.filter((r) => r.status === "Reserved").length}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
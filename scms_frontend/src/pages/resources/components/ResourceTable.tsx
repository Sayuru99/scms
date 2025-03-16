
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Trash2, Calendar } from "lucide-react";

interface ResourceTableProps {
  resources: any[];
  resourceTypes: any[];
  permissions: string[];
  role: string;
  page: number;
  totalResources: number;
  filterType?: string;
  onFilterTypeChange: (value: string | undefined) => void;
  onPageChange: (page: number) => void;
  onEditResource: (resource: any) => void;
  onRequestResource: (resource: any) => void;
  onDeleteResource: (id: number) => void;
}

export default function ResourceTable({
  resources,
  resourceTypes,
  permissions,
  role,
  page,
  totalResources,
  filterType,
  onFilterTypeChange,
  onPageChange,
  onEditResource,
  onRequestResource,
  onDeleteResource,
}: ResourceTableProps) {
  const canRequest = permissions.includes("create:reservations") && (role === "Student" || role === "Lecturer");

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <Select onValueChange={(value) => onFilterTypeChange(value === "all" ? undefined : value)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {resourceTypes.map((type) => (
              <SelectItem key={type.id} value={type.id.toString()}>
                {type.type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resources.map((resource) => (
            <TableRow key={resource.id}>
              <TableCell>{resource.name}</TableCell>
              <TableCell>{resource.type.type}</TableCell>
              <TableCell>{resource.status}</TableCell>
              <TableCell>
                {permissions.includes("update:resources") && (
                  <>
                    <Button variant="ghost" size="sm" onClick={() => onEditResource(resource)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDeleteResource(resource.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
                {canRequest && resource.status === "Available" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRequestResource({ id: resource.id, startTime: "", endTime: "", purpose: "" })}
                  >
                    <Calendar className="w-4 h-4 mr-2" /> Request
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between mt-4">
        <Button disabled={page === 1} onClick={() => onPageChange(page - 1)}>
          Previous
        </Button>
        <span>Page {page} of {Math.ceil(totalResources / 10)}</span>
        <Button disabled={page * 10 >= totalResources} onClick={() => onPageChange(page + 1)}>
          Next
        </Button>
      </div>
    </>
  );
}
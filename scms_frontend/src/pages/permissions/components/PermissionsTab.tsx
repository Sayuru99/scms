import { Permission } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "react-toastify";

interface PermissionsTabProps {
  allPermissions: Permission[];
  permissions: string[];
  loading: boolean;
}

export default function PermissionsTab({ allPermissions, permissions, loading }: PermissionsTabProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Permissions</h2>
        {permissions.includes("create:permissions") && (
          <Button onClick={() => toast.info("Add Permission functionality TBD")}>
            Add Permission
          </Button>
        )}
      </div>
      {loading ? (
        <div>Loading permissions...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allPermissions.map((perm) => (
              <TableRow key={perm.id}>
                <TableCell>{perm.name}</TableCell>
                <TableCell>{perm.category}</TableCell>
                <TableCell>{perm.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
import { Role } from "@/lib/api";
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

interface RolesTabProps {
  roles: Role[];
  permissions: string[];
  loading: boolean;
  onEditRole: (role: Role) => void;
}

export default function RolesTab({ roles, permissions, loading, onEditRole }: RolesTabProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Roles</h2>
        {permissions.includes("create:roles") && (
          <Button onClick={() => toast.info("Add Role functionality TBD")}>Add Role</Button>
        )}
      </div>
      {loading ? (
        <div>Loading roles...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Permissions</TableHead>
              {permissions.includes("update:roles") && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell>{role.name}</TableCell>
                <TableCell>{role.description || "No description"}</TableCell>
                <TableCell>{role.permissions.map((p) => p.name).join(", ") || "None"}</TableCell>
                {permissions.includes("update:roles") && (
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditRole(role)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
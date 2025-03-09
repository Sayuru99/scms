import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { roleService, permissionService, Role, Permission } from "@/lib/api";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface JwtPayload {
  userId: string;
  role: string;
  permissions: string[];
  exp: number;
}

function EditRoleModal({
  role,
  permissions,
  onRoleUpdated,
}: {
  role: Role;
  permissions: Permission[];
  onRoleUpdated: (updatedRole: Role) => void;
}) {
  const [editRole, setEditRole] = useState<Role>({ ...role });

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = Cookies.get("accessToken");
    if (!token) return;

    try {
      await roleService.updateRole(
        editRole.id,
        editRole.name,
        editRole.description,
        editRole.permissions.map((p) => p.name),
        token
      );
      onRoleUpdated(editRole);
      toast.success("Role updated successfully");
    } catch (err) {
      console.error("Failed to update role:", err);
      toast.error("Failed to update role");
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => onRoleUpdated(role)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Role: {role.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={editRole.name}
              onChange={(e) => setEditRole({ ...editRole, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={editRole.description || ""}
              onChange={(e) => setEditRole({ ...editRole, description: e.target.value })}
            />
          </div>
          <div>
            <Label>Permissions</Label>
            <div className="max-h-40 overflow-y-auto border rounded-md p-2">
              {permissions.map((perm) => (
                <div key={perm.id} className="flex items-center space-x-2 py-1">
                  <Checkbox
                    id={perm.id}
                    checked={editRole.permissions.some((p) => p.name === perm.name)}
                    onCheckedChange={(checked) => {
                      setEditRole({
                        ...editRole,
                        permissions: checked
                          ? [...editRole.permissions, perm]
                          : editRole.permissions.filter((p) => p.name !== perm.name),
                      });
                    }}
                  />
                  <Label htmlFor={perm.id}>{perm.name} ({perm.category})</Label>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onRoleUpdated(role)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Permissions() {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      try {
        const decoded: JwtPayload = jwtDecode(accessToken);
        setPermissions(decoded.permissions || []);
        fetchData(accessToken);
      } catch (err) {
        console.error("Failed to decode token:", err);
      }
    }
  }, []);

  const fetchData = async (token: string) => {
    setLoading(true);
    try {
      const fetchedRoles = await roleService.getRoles(token);
      const fetchedPermissions = await permissionService.getPermissions(token);
      setRoles(fetchedRoles);
      setAllPermissions(fetchedPermissions);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      toast.error("Failed to load roles or permissions");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdated = (updatedRole: Role) => {
    setRoles(roles.map((r) => (r.id === updatedRole.id ? updatedRole : r)));
    setEditingRole(null);
  };

  if (!permissions.includes("read:roles") && !permissions.includes("read:permissions")) {
    return <div className="text-red-600">Access Denied: You don’t have permission to view this page.</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Permissions Management</h1>
      <Tabs defaultValue="roles" className="w-full">
        <TabsList>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="roles">
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
                      <TableCell>
                        {role.permissions.map((p) => p.name).join(", ") || "None"}
                      </TableCell>
                      {permissions.includes("update:roles") && (
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingRole(role)}
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
        </TabsContent>

        <TabsContent value="permissions">
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
        </TabsContent>
      </Tabs>
      {editingRole && (
        <EditRoleModal
          role={editingRole}
          permissions={allPermissions}
          onRoleUpdated={handleRoleUpdated}
        />
      )}
    </div>
  );
}

export default Permissions;
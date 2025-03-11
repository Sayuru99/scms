import { useState } from "react";
import Cookies from "js-cookie";
import { Role, Permission, roleService } from "@/lib/api";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface EditRoleModalProps {
  role: Role;
  permissions: Permission[];
  onRoleUpdated: (updatedRole: Role) => void;
}

export default function EditRoleModal({ role, permissions, onRoleUpdated }: EditRoleModalProps) {
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
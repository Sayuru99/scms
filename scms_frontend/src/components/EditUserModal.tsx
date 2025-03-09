import { useState } from "react"; 
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { User, userService } from "@/lib/api";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

interface EditUserModalProps {
  user: User;
  onClose: () => void;
  onUserUpdated: (updatedUser: User) => void;
}

function EditUserModal({ user, onClose, onUserUpdated }: EditUserModalProps) {
  const [editUser, setEditUser] = useState<User>({ ...user });

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = Cookies.get("accessToken");
    if (!token) return;

    try {
      await userService.updateUser(
        editUser.id,
        {
          email: editUser.email,
          firstName: editUser.firstName,
          lastName: editUser.lastName,
          phoneNumber: editUser.phoneNumber,
          roleName: editUser.role.name,
          directPermissionNames: editUser.directPermissions?.split(","),
        },
        token
      );
      onUserUpdated(editUser);
      onClose();
      toast.success("User updated successfully");
    } catch (err) {
      console.error("Failed to update user:", err);
      toast.error("Failed to update user");
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={editUser.email}
              onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={editUser.firstName}
              onChange={(e) => setEditUser({ ...editUser, firstName: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={editUser.lastName}
              onChange={(e) => setEditUser({ ...editUser, lastName: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              value={editUser.phoneNumber || ""}
              onChange={(e) => setEditUser({ ...editUser, phoneNumber: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <Select
              value={editUser.role.name}
              onValueChange={(value: string) =>
                setEditUser({ ...editUser, role: { ...editUser.role, name: value } })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Lecturer">Lecturer</SelectItem>
                <SelectItem value="Student">Student</SelectItem>
                <SelectItem value="Staff">Staff</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Button type="button" variant="outline" onClick={() => alert("Reset Password TBD")}>
              Reset Password
            </Button>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditUserModal;
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { User, userService, roleService, permissionService, Role, Permission } from "@/lib/api";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { Checkbox } from "@/components/ui/checkbox";

interface AddUserModalProps {
  onUserAdded: (newUser: User) => void;
}

function AddUserModal({ onUserAdded }: AddUserModalProps) {
  const [open, setOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    roleName: "Student",
    directPermissionNames: [] as string[],
  });
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get("accessToken");
      if (!token) return;

      try {
        const fetchedRoles = await roleService.getRoles(token);
        const fetchedPermissions = await permissionService.getPermissions(token);
        setRoles(fetchedRoles);
        setPermissions(fetchedPermissions);
      } catch (err) {
        console.error("Failed to fetch roles or permissions:", err);
        toast.error("Failed to load roles or permissions");
      }
    };
    if (open) fetchData();
  }, [open]);

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    let newPassword = "";
    for (let i = 0; i < 12; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewUser({ ...newUser, password: newPassword });
    navigator.clipboard.writeText(newPassword);
    toast.info("Generated password copied to clipboard!");
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = Cookies.get("accessToken");
    if (!token) return;

    try {
      const response = await userService.createUser(
        {
          email: newUser.email,
          password: newUser.password,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          phoneNumber: newUser.phoneNumber || undefined,
          roleName: newUser.roleName,
          directPermissionNames: newUser.directPermissionNames.length > 0 ? newUser.directPermissionNames : undefined,
        },
        token
      );
      const userId = response.userId;
      const selectedRole = roles.find((r) => r.name === newUser.roleName) || { id: "", name: newUser.roleName, permissions: [], isDeleted: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      const createdUser: User = {
        id: userId,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        phoneNumber: newUser.phoneNumber || undefined,
        role: selectedRole,
        directPermissions: newUser.directPermissionNames.join(",") || undefined,
        isActive: true,
        isFirstLogin: true,
        isDeleted: false,
      };
      onUserAdded(createdUser);
      setOpen(false);
      setNewUser({ email: "", password: "", firstName: "", lastName: "", phoneNumber: "", roleName: "Student", directPermissionNames: [] });
    } catch (err) {
      console.error("Failed to create user:", err);
      toast.error("Failed to create user");
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setNewUser({ email: "", password: "", firstName: "", lastName: "", phoneNumber: "", roleName: "Student", directPermissionNames: [] });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>Add User</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              required
              autoComplete="off"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <div className="flex space-x-2">
              <Input
                id="password"
                type="text"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                required
                autoComplete="off"
              />
              <Button type="button" onClick={generatePassword} variant="outline">
                Generate
              </Button>
            </div>
          </div>
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={newUser.firstName}
              onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
              required
              autoComplete="off"
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={newUser.lastName}
              onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
              required
              autoComplete="off"
            />
          </div>
          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              value={newUser.phoneNumber}
              onChange={(e) => setNewUser({ ...newUser, phoneNumber: e.target.value })}
              autoComplete="off"
            />
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <Select
              value={newUser.roleName}
              onValueChange={(value) => setNewUser({ ...newUser, roleName: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.name}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Direct Permissions</Label>
            <div className="max-h-40 overflow-y-auto border rounded-md p-2">
              {permissions.map((perm) => (
                <div key={perm.id} className="flex items-center space-x-2 py-1">
                  <Checkbox
                    id={perm.id}
                    checked={newUser.directPermissionNames.includes(perm.name)}
                    onCheckedChange={(checked) => {
                      setNewUser({
                        ...newUser,
                        directPermissionNames: checked
                          ? [...newUser.directPermissionNames, perm.name]
                          : newUser.directPermissionNames.filter((p) => p !== perm.name),
                      });
                    }}
                  />
                  <Label htmlFor={perm.id}>{perm.name} ({perm.category})</Label>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddUserModal;
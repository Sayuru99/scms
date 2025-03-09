import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { userService, User } from "@/lib/api";
import { toast } from "react-toastify";

interface JwtPayload {
  userId: string;
  role: string;
  permissions: string[];
  exp: number;
}

function Users() {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>("All");
  const usersPerPage = 5;

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      try {
        const decoded: JwtPayload = jwtDecode(accessToken);
        setPermissions(decoded.permissions || []);
        fetchUsers(accessToken);
      } catch (err) {
        console.error("Failed to decode token:", err);
      }
    }
  }, []);

  const fetchUsers = async (token: string) => {
    setLoading(true);
    try {
      const fetchedUsers = await userService.getUsers(token);
      setUsers(fetchedUsers);
      setFilteredUsers(fetchedUsers);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    if (roleFilter === "All") {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter((user) => user.role.name === roleFilter));
    }
    setCurrentPage(1); 
  }, [roleFilter, users]);

  if (!permissions.includes("crud:users")) {
    return <div className="text-red-600">Access Denied: You don’t have permission to view this page.</div>;
  }

  
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const handleDelete = async (userId: string) => {
    const token = Cookies.get("accessToken");
    if (!token) return;
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await userService.deleteUser(userId, token);
        setUsers(users.filter((u) => u.id !== userId));
        setFilteredUsers(filteredUsers.filter((u) => u.id !== userId));
        toast.success("User deleted successfully");
      } catch (err) {
        console.error("Failed to delete user:", err);
      }
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = Cookies.get("accessToken");
    if (!token || !editUser) return;

    try {
      await userService.updateUser(editUser.id, {
        email: editUser.email,
        firstName: editUser.firstName,
        lastName: editUser.lastName,
        phoneNumber: editUser.phoneNumber,
        roleName: editUser.role.name,
        directPermissionNames: editUser.directPermissions?.split(","),
      }, token);
      setUsers(users.map((u) => (u.id === editUser.id ? editUser : u)));
      setFilteredUsers(filteredUsers.map((u) => (u.id === editUser.id ? editUser : u)));
      setEditUser(null);
      toast.success("User updated successfully");
    } catch (err) {
      console.error("Failed to update user:", err);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Users</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Total Users</h2>
          <p className="text-gray-600">All registered users in the system.</p>
          <div className="mt-4">
            <p className="text-2xl font-bold text-blue-600">{users.length}</p>
            <p className="text-sm text-gray-500">Users</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Active Admins</h2>
          <p className="text-gray-600">Currently active admin users.</p>
          <div className="mt-4">
            <p className="text-2xl font-bold text-green-600">
              {users.filter((u) => u.role.name === "Admin" && u.isActive).length}
            </p>
            <p className="text-sm text-gray-500">Active Admins</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">User List</h2>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Admin">Admins</SelectItem>
              <SelectItem value="Lecturer">Lecturers</SelectItem>
              <SelectItem value="Student">Students</SelectItem>
              <SelectItem value="Staff">Staff</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="text-center py-4">Loading users...</div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>First Name</TableHead>
                  <TableHead>Last Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.firstName}</TableCell>
                    <TableCell>{user.lastName}</TableCell>
                    <TableCell>{user.role.name}</TableCell>
                    <TableCell className="space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setEditUser(user)}>
                            Edit
                          </Button>
                        </DialogTrigger>
                        {editUser && (
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
                                <Button type="button" variant="outline" onClick={() => setEditUser(null)}>
                                  Cancel
                                </Button>
                                <Button type="submit">Save</Button>
                              </div>
                            </form>
                          </DialogContent>
                        )}
                      </Dialog>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(user.id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex justify-between mt-4">
              <Button onClick={handlePrev} disabled={currentPage === 1}>
                Previous
              </Button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <Button onClick={handleNext} disabled={currentPage === totalPages}>
                Next
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Users;
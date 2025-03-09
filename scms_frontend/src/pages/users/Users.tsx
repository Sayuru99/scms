import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { userService, User } from "@/lib/api";
import { toast } from "react-toastify";
import UserCards from "../../components/UserCards";
import UserList from "../../components/UserList";
import AddUserModal from "../../components/AddUserModal";

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
  const [loading, setLoading] = useState(false);
  const [roleFilter, setRoleFilter] = useState<string>("All");

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
  }, [roleFilter, users]);

  if (!permissions.includes("crud:users")) {
    return <div className="text-red-600">Access Denied: You don’t have permission to view this page.</div>;
  }

  const handleUserAdded = (newUser: User) => {
    setUsers([...users, newUser]);
    setFilteredUsers([...filteredUsers, newUser]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Users</h1>
        <AddUserModal onUserAdded={handleUserAdded} />
      </div>
      <UserCards users={users} />
      <UserList
        users={filteredUsers}
        loading={loading}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        setUsers={setUsers}
        setFilteredUsers={setFilteredUsers}
      />
    </div>
  );
}

export default Users;
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { roleService, permissionService, Role, Permission } from "@/lib/api";
import { toast } from "react-toastify";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RolesTab from "./components/RolesTab";
import PermissionsTab from "./components/PermissionsTab";
import EditRoleModal from "./components/EditRoleModal";

interface JwtPayload {
  userId: string;
  role: string;
  permissions: string[];
  exp: number;
}

export default function Permissions() {
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
          <RolesTab
            roles={roles}
            permissions={permissions}
            loading={loading}
            onEditRole={setEditingRole}
          />
        </TabsContent>
        <TabsContent value="permissions">
          <PermissionsTab
            allPermissions={allPermissions}
            permissions={permissions}
            loading={loading}
          />
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
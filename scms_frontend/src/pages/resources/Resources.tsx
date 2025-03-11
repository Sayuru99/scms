// src/pages/resources/Resources.tsx
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { resourceService } from "@/lib/api";
import { toast } from "react-toastify";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ResourceCards from "./components/ResourceCards";
import ReservationTable from "./components/ReservationTable";
import ResourceTable from "./components/ResourceTable";
import CreateResourceDialog from "./components/CreateResourceDialog";
import EditResourceDialog from "./components/EditResourceDialog";
import RequestResourceDialog from "./components/RequestResourceDialog";
import CreateResourceTypeDialog from "./components/CreateResourceTypeDialog";
import EditResourceTypeDialog from "./components/EditResourceTypeDialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface JwtPayload {
  userId: string;
  role: string;
  permissions: string[];
  exp: number;
}

function Resources() {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [role, setRole] = useState<string>("");
  const [activeTab, setActiveTab] = useState("resources");
  const [resources, setResources] = useState<any[]>([]);
  const [resourceTypes, setResourceTypes] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalResources, setTotalResources] = useState(0);
  const [filterType, setFilterType] = useState<string | undefined>(undefined);
  const [newResource, setNewResource] = useState({ name: "", description: "", typeId: "" });
  const [editResource, setEditResource] = useState<any | null>(null);
  const [requestResource, setRequestResource] = useState<any | null>(null);
  const [newResourceType, setNewResourceType] = useState("");
  const [editResourceType, setEditResourceType] = useState<any | null>(null);

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      try {
        const decoded: JwtPayload = jwtDecode(accessToken);
        setPermissions(decoded.permissions || []);
        setRole(decoded.role);
        fetchResources(accessToken, page, filterType);
        fetchResourceTypes(accessToken);
        fetchReservations(accessToken);
      } catch (err) {
        console.error("Failed to decode token:", err);
      }
    }

    const interval = setInterval(() => {
      fetchReservations(Cookies.get("accessToken") || "");
    }, 10000);
    return () => clearInterval(interval);
  }, [page, filterType]);

  const fetchResources = async (token: string, pageNum: number, typeId?: string) => {
    try {
      const data = await resourceService.getResources(token, pageNum, 10, undefined, typeId ? parseInt(typeId) : undefined);
      setResources(data.resources);
      setTotalResources(data.total);
    } catch (err) {
      console.error("Failed to fetch resources:", err);
    }
  };

  const fetchResourceTypes = async (token: string) => {
    try {
      const data = await resourceService.getResourceTypes(token);
      setResourceTypes(data);
    } catch (err) {
      console.error("Failed to fetch resource types:", err);
    }
  };

  const fetchReservations = async (token: string) => {
    try {
      const data = await resourceService.getReservations(token, 1, 5);
      setReservations(data.reservations);
    } catch (err) {
      console.error("Failed to fetch reservations:", err);
    }
  };

  const handleApproveReject = async (reservationId: number, status: "Approved" | "Rejected") => {
    const token = Cookies.get("accessToken");
    if (!token) return;

    try {
      await resourceService.updateReservation(reservationId, status, token);
      fetchReservations(token);
      fetchResources(token, page, filterType);
      toast.success(`Reservation ${status.toLowerCase()} successfully`);
    } catch (err) {
      console.error("Failed to update reservation:", err);
      toast.error("Failed to update reservation");
    }
  };

  const handleReturnResource = async (resourceId: number) => {
    const token = Cookies.get("accessToken");
    if (!token) return;

    try {
      await resourceService.returnResource(resourceId, token);
      fetchResources(token, page, filterType);
      fetchReservations(token);
      toast.success("Resource returned successfully");
    } catch (err) {
      console.error("Failed to return resource:", err);
      toast.error("Failed to return resource");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Resources</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="resource-types">Resource Types</TabsTrigger>
        </TabsList>

        <TabsContent value="resources">
          <ResourceCards resources={resources} reservations={reservations} totalResources={totalResources} />
          
          <ReservationTable
            reservations={reservations}
            permissions={permissions}
            onApproveReject={handleApproveReject}
            onReturnResource={handleReturnResource}
          />
          {permissions.includes("create:resources") && (
            <CreateResourceDialog
              newResource={newResource}
              setNewResource={setNewResource}
              resourceTypes={resourceTypes}
              onCreate={() => fetchResources(Cookies.get("accessToken") || "", page, filterType)}
            />
          )}
          
          <ResourceTable
            resources={resources}
            resourceTypes={resourceTypes}
            permissions={permissions}
            role={role}
            page={page}
            totalResources={totalResources}
            filterType={filterType}
            onFilterTypeChange={setFilterType}
            onPageChange={setPage}
            onEditResource={setEditResource}
            onRequestResource={setRequestResource}
            onDeleteResource={(id) => {
              resourceService.deleteResource(id, Cookies.get("accessToken") || "").then(() => {
                fetchResources(Cookies.get("accessToken") || "", page, filterType);
                toast.success("Resource deleted successfully");
              }).catch(err => {
                console.error("Failed to delete resource:", err);
                toast.error("Failed to delete resource");
              });
            }}
          />
          
          {editResource && (
            <EditResourceDialog
              editResource={editResource}
              setEditResource={setEditResource}
              resourceTypes={resourceTypes}
              onUpdate={() => fetchResources(Cookies.get("accessToken") || "", page, filterType)}
            />
          )}
          {requestResource && (
            <RequestResourceDialog
              requestResource={requestResource}
              setRequestResource={setRequestResource}
              onRequest={() => {
                fetchResources(Cookies.get("accessToken") || "", page, filterType);
                fetchReservations(Cookies.get("accessToken") || "");
              }}
            />
          )}
        </TabsContent>

        <TabsContent value="resource-types">
          {permissions.includes("create:resource_types") && (
            <CreateResourceTypeDialog
              newResourceType={newResourceType}
              setNewResourceType={setNewResourceType}
              onCreate={() => fetchResourceTypes(Cookies.get("accessToken") || "")}
            />
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                {permissions.includes("update:resource_types") && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {resourceTypes.map((type) => (
                <TableRow key={type.id}>
                  <TableCell>{type.type}</TableCell>
                  {permissions.includes("update:resource_types") && (
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => setEditResourceType(type)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          resourceService.deleteResourceType(type.id, Cookies.get("accessToken") || "").then(() => {
                            fetchResourceTypes(Cookies.get("accessToken") || "");
                            toast.success("Resource type deleted successfully");
                          }).catch(err => {
                            console.error("Failed to delete resource type:", err);
                            toast.error("Failed to delete resource type");
                          });
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {editResourceType && (
            <EditResourceTypeDialog
              editResourceType={editResourceType}
              setEditResourceType={setEditResourceType}
              onUpdate={() => fetchResourceTypes(Cookies.get("accessToken") || "")}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Resources;
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { resourceService } from "@/lib/api";
import { toast } from "react-toastify";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit, Trash2, Plus, CheckCircle, XCircle } from "lucide-react";

interface JwtPayload {
  userId: string;
  role: string;
  permissions: string[];
  exp: number;
}

function Resources() {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("resources");
  const [resources, setResources] = useState<any[]>([]);
  const [resourceTypes, setResourceTypes] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalResources, setTotalResources] = useState(0);
  const [filterType, setFilterType] = useState<string | undefined>(undefined);
  const [newResource, setNewResource] = useState({ name: "", description: "", typeId: "" });
  const [newResourceType, setNewResourceType] = useState("");
  const [editResource, setEditResource] = useState<any | null>(null);
  const [editResourceType, setEditResourceType] = useState<any | null>(null);

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      try {
        const decoded: JwtPayload = jwtDecode(accessToken);
        console.log(decoded.permissions);
        setPermissions(decoded.permissions || []);
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

  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = Cookies.get("accessToken");
    if (!token) return;

    try {
      await resourceService.createResource(
        {
          name: newResource.name,
          description: newResource.description || undefined,
          typeId: parseInt(newResource.typeId),
        },
        token
      );
      setNewResource({ name: "", description: "", typeId: "" });
      fetchResources(token, page, filterType);
    } catch (err) {
      console.error("Failed to create resource:", err);
    }
  };

  const handleCreateResourceType = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = Cookies.get("accessToken");
    if (!token) return;

    try {
      await resourceService.createResourceType(newResourceType, token);
      setNewResourceType("");
      fetchResourceTypes(token);
    } catch (err) {
      console.error("Failed to create resource type:", err);
    }
  };

  const handleUpdateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = Cookies.get("accessToken");
    if (!token || !editResource) return;

    try {
      await resourceService.updateResource(
        editResource.id,
        {
          name: editResource.name,
          description: editResource.description || undefined,
          typeId: editResource.type.id,
        },
        token
      );
      setEditResource(null);
      fetchResources(token, page, filterType);
    } catch (err) {
      console.error("Failed to update resource:", err);
    }
  };

  const handleUpdateResourceType = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = Cookies.get("accessToken");
    if (!token || !editResourceType) return;

    try {
      await resourceService.updateResourceType(editResourceType.id, editResourceType.type, token);
      setEditResourceType(null);
      fetchResourceTypes(token);
    } catch (err) {
      console.error("Failed to update resource type:", err);
    }
  };

  const handleDeleteResource = async (resourceId: number) => {
    const token = Cookies.get("accessToken");
    if (!token) return;

    try {
      await resourceService.deleteResource(resourceId, token);
      fetchResources(token, page, filterType);
    } catch (err) {
      console.error("Failed to delete resource:", err);
    }
  };

  const handleDeleteResourceType = async (typeId: number) => {
    const token = Cookies.get("accessToken");
    if (!token) return;

    try {
      await resourceService.deleteResourceType(typeId, token);
      fetchResourceTypes(token);
    } catch (err) {
      console.error("Failed to delete resource type:", err);
    }
  };

  const handleApproveReject = async (reservationId: number, status: "Approved" | "Rejected") => {
    const token = Cookies.get("accessToken");
    if (!token) return;

    try {
      await resourceService.updateReservation(reservationId, status, token);
      fetchReservations(token);
      fetchResources(token, page, filterType);
    } catch (err) {
      console.error("Failed to update reservation:", err);
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Total Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{totalResources}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Pending Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {reservations.filter((r) => r.status === "Pending").length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Approved Reservations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {reservations.filter((r) => r.status === "Approved").length}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Recent Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>Status</TableHead>
                    {permissions.includes("update:reservations") && <TableHead>Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservations.map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell>{`${reservation.user.firstName} ${reservation.user.lastName}`}</TableCell>
                      <TableCell>{reservation.resource.name}</TableCell>
                      <TableCell>{new Date(reservation.startTime).toLocaleString()}</TableCell>
                      <TableCell>{reservation.status}</TableCell>
                      {permissions.includes("update:reservations") && (
                        <TableCell>
                          {reservation.status === "Pending" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleApproveReject(reservation.id, "Approved")}
                                className="mr-2"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleApproveReject(reservation.id, "Rejected")}
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="flex justify-between items-center mb-4">
            <Select onValueChange={(value) => setFilterType(value === "all" ? undefined : value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {resourceTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id.toString()}>
                    {type.type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {permissions.includes("create:resources") && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button><Plus className="w-4 h-4 mr-2" /> Add Resource</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Resource</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateResource} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={newResource.name}
                        onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={newResource.description}
                        onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="typeId">Type</Label>
                      <Select onValueChange={(value) => setNewResource({ ...newResource, typeId: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {resourceTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id.toString()}>
                              {type.type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit">Create</Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                {permissions.includes("update:resources") && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {resources.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell>{resource.name}</TableCell>
                  <TableCell>{resource.type.type}</TableCell>
                  <TableCell>{resource.status}</TableCell>
                  {permissions.includes("update:resources") && (
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditResource(resource)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteResource(resource.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-between mt-4">
            <Button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <span>Page {page} of {Math.ceil(totalResources / 10)}</span>
            <Button
              disabled={page * 10 >= totalResources}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>

          {editResource && (
            <Dialog open={!!editResource} onOpenChange={() => setEditResource(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Resource</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleUpdateResource} className="space-y-4">
                  <div>
                    <Label htmlFor="editName">Name</Label>
                    <Input
                      id="editName"
                      value={editResource.name}
                      onChange={(e) => setEditResource({ ...editResource, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="editDescription">Description</Label>
                    <Input
                      id="editDescription"
                      value={editResource.description || ""}
                      onChange={(e) => setEditResource({ ...editResource, description: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="editTypeId">Type</Label>
                    <Select
                      onValueChange={(value) => setEditResource({ ...editResource, type: { ...editResource.type, id: parseInt(value) } })}
                      defaultValue={editResource.type.id.toString()}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {resourceTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id.toString()}>
                            {type.type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit">Update</Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </TabsContent>

        <TabsContent value="resource-types">
          {permissions.includes("create:resource_types") && (
            <div className="mb-6">
              <Dialog>
                <DialogTrigger asChild>
                  <Button><Plus className="w-4 h-4 mr-2" /> Add Resource Type</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Resource Type</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateResourceType} className="space-y-4">
                    <div>
                      <Label htmlFor="type">Type</Label>
                      <Input
                        id="type"
                        value={newResourceType}
                        onChange={(e) => setNewResourceType(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit">Create</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
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
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditResourceType(type)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteResourceType(type.id)}
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
            <Dialog open={!!editResourceType} onOpenChange={() => setEditResourceType(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Resource Type</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleUpdateResourceType} className="space-y-4">
                  <div>
                    <Label htmlFor="editType">Type</Label>
                    <Input
                      id="editType"
                      value={editResourceType.type}
                      onChange={(e) => setEditResourceType({ ...editResourceType, type: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit">Update</Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Resources;
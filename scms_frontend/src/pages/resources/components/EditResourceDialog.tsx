
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { resourceService } from "@/lib/api";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

interface EditResourceDialogProps {
  editResource: any;
  setEditResource: (resource: any | null) => void;
  resourceTypes: any[];
  onUpdate: () => void;
}

export default function EditResourceDialog({ editResource, setEditResource, resourceTypes, onUpdate }: EditResourceDialogProps) {
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
          status: editResource.status,
        },
        token
      );
      setEditResource(null);
      onUpdate();
      toast.success("Resource updated successfully");
    } catch (err) {
      console.error("Failed to update resource:", err);
      toast.error("Failed to update resource");
    }
  };

  return (
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
          <div>
            <Label htmlFor="editStatus">Status</Label>
            <Select
              onValueChange={(value) => setEditResource({ ...editResource, status: value })}
              defaultValue={editResource.status}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="Requested">Requested</SelectItem>
                <SelectItem value="Reserved">Reserved</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit">Update</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
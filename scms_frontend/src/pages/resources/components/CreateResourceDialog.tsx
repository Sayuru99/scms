// src/pages/resources/components/CreateResourceDialog.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { resourceService } from "@/lib/api";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

interface CreateResourceDialogProps {
  newResource: { name: string; description: string; typeId: string };
  setNewResource: (resource: { name: string; description: string; typeId: string }) => void;
  resourceTypes: any[];
  onCreate: () => void;
}

export default function CreateResourceDialog({ newResource, setNewResource, resourceTypes, onCreate }: CreateResourceDialogProps) {
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
          status: "Available",
        },
        token
      );
      setNewResource({ name: "", description: "", typeId: "" });
      onCreate();
      toast.success("Resource created successfully");
    } catch (err) {
      console.error("Failed to create resource:", err);
      toast.error("Failed to create resource");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mb-4"><Plus className="w-4 h-4 mr-2" /> Add Resource</Button>
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
  );
}
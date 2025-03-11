// src/pages/resources/components/CreateResourceTypeDialog.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { resourceService } from "@/lib/api";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

interface CreateResourceTypeDialogProps {
  newResourceType: string;
  setNewResourceType: (type: string) => void;
  onCreate: () => void;
}

export default function CreateResourceTypeDialog({ newResourceType, setNewResourceType, onCreate }: CreateResourceTypeDialogProps) {
  const handleCreateResourceType = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = Cookies.get("accessToken");
    if (!token) return;

    try {
      await resourceService.createResourceType(newResourceType, token);
      setNewResourceType("");
      onCreate();
      toast.success("Resource type created successfully");
    } catch (err) {
      console.error("Failed to create resource type:", err);
      toast.error("Failed to create resource type");
    }
  };

  return (
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
  );
}
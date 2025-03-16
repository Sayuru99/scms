
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { resourceService } from "@/lib/api";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

interface EditResourceTypeDialogProps {
  editResourceType: any;
  setEditResourceType: (type: any | null) => void;
  onUpdate: () => void;
}

export default function EditResourceTypeDialog({ editResourceType, setEditResourceType, onUpdate }: EditResourceTypeDialogProps) {
  const handleUpdateResourceType = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = Cookies.get("accessToken");
    if (!token || !editResourceType) return;

    try {
      await resourceService.updateResourceType(editResourceType.id, editResourceType.type, token);
      setEditResourceType(null);
      onUpdate();
      toast.success("Resource type updated successfully");
    } catch (err) {
      console.error("Failed to update resource type:", err);
      toast.error("Failed to update resource type");
    }
  };

  return (
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
  );
}
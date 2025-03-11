// src/pages/resources/components/RequestResourceDialog.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { resourceService } from "@/lib/api";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

interface RequestResourceDialogProps {
  requestResource: any;
  setRequestResource: (resource: any | null) => void;
  onRequest: () => void;
}

export default function RequestResourceDialog({ requestResource, setRequestResource, onRequest }: RequestResourceDialogProps) {
  const handleRequestResource = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = Cookies.get("accessToken");
    if (!token || !requestResource) return;

    try {
      await resourceService.requestResource(
        requestResource.id,
        {
          startTime: requestResource.startTime,
          endTime: requestResource.endTime,
          purpose: requestResource.purpose || undefined,
        },
        token
      );
      setRequestResource(null);
      onRequest();
      toast.success("Resource requested successfully");
    } catch (err) {
      console.error("Failed to request resource:", err);
      toast.error("Failed to request resource");
    }
  };

  return (
    <Dialog open={!!requestResource} onOpenChange={() => setRequestResource(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Resource</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleRequestResource} className="space-y-4">
          <div>
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              id="startTime"
              type="datetime-local"
              value={requestResource.startTime}
              onChange={(e) => setRequestResource({ ...requestResource, startTime: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="endTime">End Time</Label>
            <Input
              id="endTime"
              type="datetime-local"
              value={requestResource.endTime}
              onChange={(e) => setRequestResource({ ...requestResource, endTime: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="purpose">Purpose</Label>
            <Input
              id="purpose"
              value={requestResource.purpose}
              onChange={(e) => setRequestResource({ ...requestResource, purpose: e.target.value })}
            />
          </div>
          <Button type="submit">Request</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { courseService } from "@/lib/api";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

interface EditCourseDialogProps {
  editCourse: any;
  setEditCourse: (course: any | null) => void;
  onUpdate: () => void;
}

export default function EditCourseDialog({ editCourse, setEditCourse, onUpdate }: EditCourseDialogProps) {
  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = Cookies.get("accessToken");
    if (!token || !editCourse) return;

    try {
      await courseService.updateCourse(
        editCourse.id,
        {
          code: editCourse.code,
          name: editCourse.name,
          description: editCourse.description || undefined,
          credits: parseInt(editCourse.credits),
        },
        token
      );
      setEditCourse(null);
      onUpdate();
      toast.success("Course updated successfully");
    } catch (err) {
      console.error("Failed to update course:", err);
      toast.error("Failed to update course");
    }
  };

  return (
    <Dialog open={!!editCourse} onOpenChange={() => setEditCourse(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Course</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleUpdateCourse} className="space-y-4">
          <div>
            <Label htmlFor="editCode">Code</Label>
            <Input
              id="editCode"
              value={editCourse.code}
              onChange={(e) => setEditCourse({ ...editCourse, code: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="editName">Name</Label>
            <Input
              id="editName"
              value={editCourse.name}
              onChange={(e) => setEditCourse({ ...editCourse, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="editDescription">Description</Label>
            <Input
              id="editDescription"
              value={editCourse.description || ""}
              onChange={(e) => setEditCourse({ ...editCourse, description: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="editCredits">Credits</Label>
            <Input
              id="editCredits"
              type="number"
              value={editCourse.credits}
              onChange={(e) => setEditCourse({ ...editCourse, credits: e.target.value })}
              required
            />
          </div>
          <Button type="submit">Update</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { courseService } from "@/lib/api";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

interface Course {
  id: number;
  code: string;
  name: string;
  description?: string;
  credits: number;
}

interface EditCourseDialogProps {
  editCourse: Course;
  setEditCourse: React.Dispatch<React.SetStateAction<Course | null>>;
  onUpdate: () => void;
}

export default function EditCourseDialog({
  editCourse,
  setEditCourse,
  onUpdate,
}: EditCourseDialogProps) {
  const [open, setOpen] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = Cookies.get("accessToken");
    if (!token) return;

    try {
      await courseService.updateCourse(
        editCourse.id,
        {
          code: editCourse.code,
          name: editCourse.name,
          description: editCourse.description,
          credits: editCourse.credits,
        },
        token
      );
      toast.success("Course updated successfully");
      setEditCourse(null);
      setOpen(false);
      onUpdate();
    } catch (err) {
      console.error("Failed to update course:", err);
      toast.error("Failed to update course");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && setEditCourse(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Course</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="code">Code</Label>
            <Input
              id="code"
              value={editCourse.code}
              onChange={(e) =>
                setEditCourse({ ...editCourse, code: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={editCourse.name}
              onChange={(e) =>
                setEditCourse({ ...editCourse, name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={editCourse.description || ""}
              onChange={(e) =>
                setEditCourse({ ...editCourse, description: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="credits">Credits</Label>
            <Input
              id="credits"
              type="number"
              value={editCourse.credits}
              onChange={(e) =>
                setEditCourse({ ...editCourse, credits: parseInt(e.target.value) })
              }
              required
            />
          </div>
          <Button type="submit">Update</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
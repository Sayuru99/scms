import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Course, courseService } from "@/lib/api";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

interface EditCourseModalProps {
  course: Course;
  onClose: () => void;
  onCourseUpdated: (updatedUser: Course) => void;
}

function EditCourseModal({ course, onClose, onCourseUpdated }: EditCourseModalProps) {
  const [editCourse, setEditCourse] = useState<Course>({...course  });

  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get("accessToken");
      if (!token) return;
    };
    fetchData();
  }, []);

  const handleEditSubmit = async (e: React.FormEvent) => {
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
      onCourseUpdated(editCourse);
      onClose();
      toast.success("course updated successfully");
    } catch (err) {
      console.error("Failed to update course:", err);
      toast.error("Failed to update course");
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit course</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <Label htmlFor="code">Course Code</Label>
            <Input
              id="code"
              value={editCourse.code}
              onChange={(e) => setEditCourse({ ...editCourse, code: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="courseName">First Name</Label>
            <Input
              id="courseName"
              value={editCourse.name}
              onChange={(e) => setEditCourse({ ...editCourse, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={editCourse.description}
              onChange={(e) => setEditCourse({ ...editCourse, description: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="credits">Credits</Label>
            <Input
              id="credits"
              value={editCourse.credits || ""}
              onChange={(e) => setEditCourse({ ...editCourse, credits: Number(e.target.value) })}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditCourseModal;
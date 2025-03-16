import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { courseService } from "@/lib/api";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { Plus } from "lucide-react";

interface CreateCourseDialogProps {
  newCourse: { code: string; name: string; description: string; credits: string };
  setNewCourse: React.Dispatch<
    React.SetStateAction<{ code: string; name: string; description: string; credits: string }>
  >;
  onCreate: () => void;
}

export default function CreateCourseDialog({
  newCourse,
  setNewCourse,
  onCreate,
}: CreateCourseDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = Cookies.get("accessToken");
    if (!token) return;

    try {
      await courseService.createCourse(
        {
          code: newCourse.code,
          name: newCourse.name,
          description: newCourse.description,
          credits: parseInt(newCourse.credits),
        },
        token
      );
      toast.success("Course created successfully");
      setNewCourse({ code: "", name: "", description: "", credits: "" });
      setOpen(false);
      onCreate();
    } catch (err) {
      console.error("Failed to create course:", err);
      toast.error("Failed to create course");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex justify-end mb-4">
          <Button><Plus className="w-4 h-4 mr-2" /> Add Course</Button>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Course</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="code">Code</Label>
            <Input
              id="code"
              value={newCourse.code}
              onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={newCourse.name}
              onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={newCourse.description}
              onChange={(e) =>
                setNewCourse({ ...newCourse, description: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="credits">Credits</Label>
            <Input
              id="credits"
              type="number"
              value={newCourse.credits}
              onChange={(e) => setNewCourse({ ...newCourse, credits: e.target.value })}
              required
            />
          </div>
          <Button type="submit">Create</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
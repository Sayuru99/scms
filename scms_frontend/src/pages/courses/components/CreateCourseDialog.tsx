
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { courseService } from "@/lib/api";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

interface CreateCourseDialogProps {
  newCourse: { code: string; name: string; description: string; credits: string };
  setNewCourse: (course: { code: string; name: string; description: string; credits: string }) => void;
  onCreate: () => void;
}

export default function CreateCourseDialog({ newCourse, setNewCourse, onCreate }: CreateCourseDialogProps) {
  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = Cookies.get("accessToken");
    if (!token) return;

    try {
      await courseService.createCourse(
        {
          code: newCourse.code,
          name: newCourse.name,
          description: newCourse.description || undefined,
          credits: parseInt(newCourse.credits),
        },
        token
      );
      setNewCourse({ code: "", name: "", description: "", credits: "" });
      onCreate();
      toast.success("Course created successfully");
    } catch (err) {
      console.error("Failed to create course:", err);
      toast.error("Failed to create course");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mb-4"><Plus className="w-4 h-4 mr-2" /> Add Course</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Course</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreateCourse} className="space-y-4">
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
              onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
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
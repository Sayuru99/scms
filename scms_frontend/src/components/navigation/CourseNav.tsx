import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface CourseNavProps {
  permissions: string[];
}

const CourseNav: React.FC<CourseNavProps> = ({ permissions }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isManagePage = location.pathname === '/courses/manage';
  const isEditPage = location.pathname.startsWith('/courses/manage/');

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => navigate('/courses')}
          className={cn(
            "text-sm font-semibold transition-colors hover:text-primary",
            location.pathname === '/courses' ? "text-primary" : "text-muted-foreground"
          )}
        >
          Courses
        </button>
        {(isManagePage || isEditPage) && (
          <>
            <span className="text-muted-foreground text-sm">/</span>
            <span className="text-sm font-semibold text-primary">
              {isEditPage ? 'Edit Course' : 'Create Course'}
            </span>
          </>
        )}
      </div>
      
      {permissions.includes("create:courses") && location.pathname === '/courses' && (
        <Button onClick={() => navigate('/courses/manage')}>
          <Plus className="w-4 h-4 mr-2" /> Create Course
        </Button>
      )}
    </div>
  );
};

export default CourseNav; 
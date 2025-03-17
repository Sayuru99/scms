import CourseBuilder from './components/CourseBuilder';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useLocation, useParams } from "react-router-dom";

const ManageCourse = () => {
  const location = useLocation();
  const { courseId } = useParams();

  const getBreadcrumbItems = () => {
    const path = location.pathname;
    
    if (path === '/courses/manage') {
      return (
        <>
          <BreadcrumbItem>
            <BreadcrumbLink href="/courses">Courses</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Add Course</BreadcrumbPage>
          </BreadcrumbItem>
        </>
      );
    }

    if (path.startsWith('/courses/manage/') && courseId) {
      return (
        <>
          <BreadcrumbItem>
            <BreadcrumbLink href="/courses">Courses</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Update Course</BreadcrumbPage>
          </BreadcrumbItem>
        </>
      );
    }

    return null;
  };

  return (
    <div className="bg-background py-8 px-4 sm:px-6">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          {getBreadcrumbItems()}
        </BreadcrumbList>
      </Breadcrumb>
      <CourseBuilder />
    </div>
  );
};

export default ManageCourse;
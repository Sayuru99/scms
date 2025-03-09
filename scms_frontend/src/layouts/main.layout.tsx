import Sidebar from "@/components/shared/Sidebar";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <div className="flex h-screen w-screen">
      <Sidebar />
      <div className="flex-1 h-full overflow-y-auto bg-gray-100">
        <div className="p-6 h-full w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
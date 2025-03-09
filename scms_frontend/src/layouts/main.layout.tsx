import NavBar from "@/components/shared/Navbar";
import { Outlet } from "react-router-dom";

function MainLayout(){
    return (
        <div>
            <NavBar />
            <Outlet />
        </div>
    );
}

export default MainLayout;

import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaUsers, FaCalendarAlt, FaBullhorn, FaLock, FaComments } from "react-icons/fa"; 
import { Album, BookOpen, Briefcase } from "lucide-react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  userId: string;
  role: string;
  permissions: string[];
  exp: number;
}

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [permissions, setPermissions] = useState<string[]>([]);

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      try {
        const decoded: JwtPayload = jwtDecode(accessToken);
        setPermissions(decoded.permissions || []);
      } catch (err) {
        console.error("Failed to decode token:", err);
      }
    }
  }, []);

  const menuItems = [
    { name: "Dashboard", path: "/", icon: <FaTachometerAlt className="w-5 h-5" />, requiredPermission: null },
    { name: "Users", path: "/users", icon: <FaUsers className="w-5 h-5" />, requiredPermission: "create:users" },
    { name: "Permissions", path: "/permissions", icon: <FaLock className="w-5 h-5" />, requiredPermission: "read:roles" },
    { name: "Courses", path: "/courses", icon: <BookOpen className="w-5 h-5" />, requiredPermission: "create:courses" },
    { name: "Resources", path: "/resources", icon: <Briefcase className="w-5 h-5" />, requiredPermission: "read:resources" },
    { name: "Calendar", path: "/calendar", icon: <FaCalendarAlt className="w-5 h-5" />, requiredPermission: "read:events" },
    { name: "Reservation", path: "/reservation", icon: <Album className="w-5 h-5" />, requiredPermission: "reserve:resources" },
    { name: "Events", path: "/events", icon: <FaBullhorn className="w-5 h-5" />, requiredPermission: "read:events" },
    { name: "Chat", path: "/chat", icon: <FaComments className="w-5 h-5" />, requiredPermission: "read:messages" }, 
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    item.requiredPermission === null || permissions.includes(item.requiredPermission)
  );

  return (
    <div
      className={`${
        isOpen ? "w-64" : "w-20"
      } bg-gray-800 text-white h-screen p-5 transition-all duration-300 flex flex-col`}
    >
      <div className="flex justify-end mb-6">
        <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {isOpen && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold">ESOFT SCMS</h2>
        </div>
      )}

      <nav className="flex-1">
        <ul className="space-y-2">
          {filteredMenuItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg transition-colors duration-200 ${
                    isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700"
                  }`
                }
              >
                <span className="mr-3">{item.icon}</span>
                {isOpen && <span>{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {isOpen && (
        <div className="mt-auto text-sm text-gray-400">
          <p>© 2025 SCMS</p>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  userId: string;
  role: string;
  permissions: string[];
  exp: number;
}

function Dashboard() {
  const [greeting, setGreeting] = useState("");
  const [userName, setUserName] = useState("User");
  const [permissions, setPermissions] = useState<string[]>([]);

  useEffect(() => {
    
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      try {
        const decoded: JwtPayload = jwtDecode(accessToken);
        setUserName(decoded.userId);
        setPermissions(decoded.permissions || []);
      } catch (err) {
        console.error("Failed to decode token:", err);
      }
    }
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{`${greeting}, ${userName}!`}</h1>
      <p className="text-gray-600">Welcome to your SCMS Dashboard.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Overview</h2>
          <p className="text-gray-600">Quick stats about your activity.</p>
          <div className="mt-4">
            <p className="text-2xl font-bold text-blue-600">5</p>
            <p className="text-sm text-gray-500">Pending Tasks</p>
          </div>
        </div>

        {/* Card 2: Current Users (visible only with crud:users) */}
        {permissions.includes("crud:users") && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Current Users</h2>
            <p className="text-gray-600">Total active users in the system.</p>
            <div className="mt-4">
              <p className="text-2xl font-bold text-green-600">42</p>
              <p className="text-sm text-gray-500">Active Users</p>
            </div>
          </div>
        )}

        {permissions.includes("view:events") && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Upcoming Events</h2>
            <p className="text-gray-600">Events scheduled this week.</p>
            <div className="mt-4">
              <p className="text-2xl font-bold text-purple-600">3</p>
              <p className="text-sm text-gray-500">Events</p>
            </div>
          </div>
        )}

        {permissions.includes("view:calendar") && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Calendar Overview</h2>
            <p className="text-gray-600">Your upcoming schedule.</p>
            <div className="mt-4">
              <p className="text-2xl font-bold text-orange-600">2</p>
              <p className="text-sm text-gray-500">Upcoming Appointments</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { userService, authService } from "@/lib/api";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { User } from "@/lib/api";

interface JwtPayload {
  userId: string;
  role: string;
  permissions: string[];
  exp: number;
  firstName: string;
}

function Dashboard() {
  const [greeting, setGreeting] = useState("");
  const [userName, setUserName] = useState("User");
  const [permissions, setPermissions] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [editDetails, setEditDetails] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      try {
        const decoded: JwtPayload = jwtDecode(accessToken);
        // console.log(decoded);
        setUserName(`${decoded.firstName}`);
        setPermissions(decoded.permissions || []);
        setUserId(decoded.userId);
        fetchUserDetails(decoded.userId, accessToken);
      } catch (err) {
        console.error("Failed to decode token:", err);
      }
    }
  }, []);

  const fetchUserDetails = async (userId: string, token: string) => {
    try {
      const users = await userService.getUsers(token);
      const currentUser = users.find((u) => u.id === userId);
      if (currentUser) {
        setUserDetails(currentUser);
        setEditDetails({
          email: currentUser.email,
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          phoneNumber: currentUser.phoneNumber || "",
        });
        setUserName(`${currentUser.firstName} ${currentUser.lastName}`);
      }
    } catch (err) {
      console.error("Failed to fetch user details:", err);
      toast.error("Failed to load your profile");
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = Cookies.get("accessToken");
    if (!token || !userId) return;

    try {
      await userService.updateUser(userId, editDetails, token);
      setUserDetails({
        ...userDetails!,
        email: editDetails.email,
        firstName: editDetails.firstName,
        lastName: editDetails.lastName,
        phoneNumber: editDetails.phoneNumber,
      });
      setUserName(`${editDetails.firstName} ${editDetails.lastName}`);
      setIsProfileOpen(false);
      toast.success("Profile updated successfully");
    } catch (err) {
      console.error("Failed to update profile:", err);
      toast.error("Failed to update profile");
    }
  };

  const handleLogout = async () => {
    const token = Cookies.get("accessToken");
    const refreshToken = Cookies.get("refreshToken");
    if (token) {
      try {
        await authService.logout(refreshToken, token);
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        window.location.href = "/login";
      } catch (err) {
        console.error("Failed to logout:", err);
        toast.error("Failed to logout");
      }
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{`${greeting}, ${userName}!`}</h1>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsProfileOpen(true)}
          className="rounded-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 11c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
            />
          </svg>
        </Button>
      </div>
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

        {permissions.includes("read:users") && (
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

      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isProfileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Your Profile</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsProfileOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Button>
          </div>

          {userDetails ? (
            <form onSubmit={handleProfileUpdate} className="space-y-4 flex-grow">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={editDetails.email}
                  onChange={(e) =>
                    setEditDetails({ ...editDetails, email: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={editDetails.firstName}
                  onChange={(e) =>
                    setEditDetails({ ...editDetails, firstName: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={editDetails.lastName}
                  onChange={(e) =>
                    setEditDetails({ ...editDetails, lastName: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={editDetails.phoneNumber}
                  onChange={(e) =>
                    setEditDetails({ ...editDetails, phoneNumber: e.target.value })
                  }
                />
              </div>
              <Button type="submit" className="w-full">
                Update
              </Button>
            </form>
          ) : (
            <p className="flex-grow">Loading profile...</p>
          )}

          <div className="mt-6">
            <Button
              variant="outline"
              className="w-full text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      {isProfileOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm z-40"
          onClick={() => setIsProfileOpen(false)}
        />
      )}
    </div>
  );
}

export default Dashboard;
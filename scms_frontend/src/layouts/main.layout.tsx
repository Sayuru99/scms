// src/layouts/main.layout.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/shared/Sidebar";
import { Outlet } from "react-router-dom";
import { chatService, userService } from "@/lib/api";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import {
  Button,
} from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";

interface JwtPayload {
  userId: string;
  role: string;
  permissions: string[];
  exp: number;
}

function MainLayout() {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [newChatEmail, setNewChatEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      try {
        const decoded: JwtPayload = jwtDecode(accessToken);
        setPermissions(decoded.permissions || []);
        setUserId(decoded.userId);
        if (decoded.permissions.includes("read:messages")) {
          fetchUsers(accessToken);
          fetchGroups(accessToken);
        }
      } catch (err) {
        console.error("Failed to decode token:", err);
      }
    }
  }, []);

  const fetchUsers = async (token: string) => {
    try {
      const data = await userService.getUsers(token);
      setUsers(data.filter((u) => u.id !== userId));
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  const fetchGroups = async (token: string) => {
    try {
      const data = await chatService.getGroups(token);
      setGroups(data);
    } catch (err) {
      console.error("Failed to fetch groups:", err);
      toast.error("Failed to load groups");
    }
  };

  const handleStartChat = (recipientId: string) => {
    navigate(`/chat?recipient=${recipientId}`);
  };

  const handleStartGroupChat = (groupId: number) => {
    navigate(`/chat?group=${groupId}`);
  };

  const handleNewChat = () => {
    const user = users.find((u) => u.email === newChatEmail);
    if (user) {
      handleStartChat(user.id);
      setNewChatEmail("");
    } else {
      alert("User not found");
    }
  };

  return (
    <div className="flex h-screen w-screen">
      <Sidebar />
      <div className="flex-1 h-full overflow-y-auto bg-gray-100">
        <div className="p-6 h-full w-full">
          <Outlet />
          {permissions.includes("read:messages") && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  className="fixed bottom-6 right-6 rounded-full w-12 h-12 p-0 bg-blue-600 hover:bg-blue-700"
                  variant="default"
                >
                  <MessageCircle className="w-6 h-6 text-white" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 mr-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Enter email to start chat"
                      value={newChatEmail}
                      onChange={(e) => setNewChatEmail(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleNewChat()}
                    />
                    <Button size="sm" onClick={handleNewChat}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <ScrollArea className="h-64">
                    <h3 className="font-semibold mb-2">Individual Chats</h3>
                    {users.slice(0, 5).map((user) => (
                      <Button
                        key={user.id}
                        variant="ghost"
                        className="w-full justify-start mb-2"
                        onClick={() => handleStartChat(user.id)}
                      >
                        <Avatar className="mr-2">
                          <AvatarFallback>
                            {user.firstName[0]}{user.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        {user.firstName} {user.lastName}
                      </Button>
                    ))}
                    <h3 className="font-semibold mb-2 mt-4">Group Chats</h3>
                    {groups.map((group) => (
                      <Button
                        key={group.id}
                        variant="ghost"
                        className="w-full justify-start mb-2"
                        onClick={() => handleStartGroupChat(group.id)}
                      >
                        <Avatar className="mr-2">
                          <AvatarFallback>{group.name[0]}</AvatarFallback>
                        </Avatar>
                        {group.name}
                      </Button>
                    ))}
                  </ScrollArea>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { chatService, userService } from "@/lib/api";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Socket } from "socket.io-client";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface Message {
  id: number;
  sender: { id: string; firstName?: string; lastName?: string };
  recipient?: { id: string };
  group?: { id: number };
  content: string;
  sentAt: string;
}

interface Group {
  id: number;
  name: string;
}

function Chat() {
  const { userId, permissions } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [groupMessages, setGroupMessages] = useState<Message[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    if (!accessToken || !userId || !permissions.includes("read:messages")) {
      toast.error("You lack permission or authentication to access chat");
      return;
    }

    const newSocket = chatService.initializeSocket(accessToken);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("WebSocket connected successfully");
      newSocket.emit("authenticate", accessToken);
    });

    newSocket.on("connect_error", (err) => {
      console.error("WebSocket connect_error:", err.message);
      toast.error(`WebSocket connection failed: ${err.message}`);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("WebSocket disconnected:", reason);
    });

    newSocket.on("newMessage", (message: Message) => {
      if (message.recipient?.id === userId && selectedRecipient === message.sender.id) {
        setMessages((prev) => [...prev, message]);
      }
    });

    newSocket.on("newGroupMessage", (message: Message) => {
      if (selectedGroup === message.group?.id) {
        setGroupMessages((prev) => [...prev, message]);
      }
    });

    newSocket.on("messageSent", (message: Message) => {
      console.log("Message sent:", message);
      if (message.recipient) {
        setMessages((prev) => [...prev, message]);
      } else if (message.group) {
        setGroupMessages((prev) => [...prev, message]);
      }
    });

    newSocket.on("error", (error: string) => {
      console.error("Socket error:", error);
      toast.error(error);
    });

    fetchUsers(accessToken);
    if (permissions.includes("read:groups")) {
      fetchGroups(accessToken);
    }

    return () => {
      console.log("Disconnecting WebSocket...");
      newSocket.disconnect();
    };
  }, [userId, permissions]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const recipient = searchParams.get("recipient");
    const group = searchParams.get("group");
    const token = Cookies.get("accessToken") || "";
    if (recipient) {
      handleSelectChat(recipient, null, token);
    } else if (group) {
      handleSelectChat(null, parseInt(group), token);
    }
  }, [location]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, groupMessages]);

  const fetchUsers = async (token: string) => {
    try {
      const data = await userService.getUsers(token);
      setUsers(data.filter((u) => u.id !== userId));
    } catch (err) {
      console.error("Failed to fetch users:", err);
      toast.error("Failed to load users");
    }
  };

  const fetchMessages = async (recipientId: string, token: string) => {
    try {
      const data = await chatService.getMessages(recipientId, token);
      setMessages(data);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
      toast.error("Failed to load messages");
    }
  };

  const fetchGroupMessages = async (groupId: number, token: string) => {
    try {
      const data = await chatService.getGroupMessages(groupId, token);
      setGroupMessages(data);
    } catch (err) {
      console.error("Failed to fetch group messages:", err);
      toast.error("Failed to load group messages");
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

  const handleSendMessage = () => {
    if (!socket || !messageInput.trim()) {
      toast.error("Socket not connected or message empty");
      return;
    }

    console.log("Sending message:", { selectedRecipient, selectedGroup, content: messageInput });
    if (selectedRecipient) {
      socket.emit("sendMessage", { recipientId: selectedRecipient, content: messageInput });
    } else if (selectedGroup) {
      socket.emit("sendGroupMessage", { groupId: selectedGroup, content: messageInput });
      socket.emit("joinGroup", selectedGroup);
    }
    setMessageInput("");
  };

  const handleSelectChat = (recipientId: string | null, groupId: number | null, token: string) => {
    setSelectedRecipient(recipientId);
    setSelectedGroup(groupId);
    setMessages([]);
    setGroupMessages([]);
    if (recipientId) {
      fetchMessages(recipientId, token);
    } else if (groupId) {
      fetchGroupMessages(groupId, token);
    }
  };
  
  return (
    <>
      {permissions.includes("read:messages") ? (
        <div className="p-6 flex h-screen gap-6">
          <Card className="w-1/4">
            <CardHeader>
              <CardTitle>Chats</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="individual" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="individual">Individual</TabsTrigger>
                  <TabsTrigger value="group">Group</TabsTrigger>
                </TabsList>
                <TabsContent value="individual">
                  <ScrollArea className="h-[calc(100vh-300px)]">
                    {users.map((user) => (
                      <Button
                        key={user.id}
                        variant={selectedRecipient === user.id ? "secondary" : "ghost"}
                        className="w-full justify-start mb-2"
                        onClick={() =>
                          handleSelectChat(user.id, null, Cookies.get("accessToken") || "")
                        }
                      >
                        <Avatar className="mr-2">
                          <AvatarFallback>
                            {user.firstName?.[0] ?? "U"}
                            {user.lastName?.[0] ?? ""}
                          </AvatarFallback>
                        </Avatar>
                        {user.firstName} {user.lastName}
                      </Button>
                    ))}
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="group">
                  <ScrollArea className="h-[calc(100vh-300px)]">
                    {groups.map((group) => (
                      <Button
                        key={group.id}
                        variant={selectedGroup === group.id ? "secondary" : "ghost"}
                        className="w-full justify-start mb-2"
                        onClick={() =>
                          handleSelectChat(null, group.id, Cookies.get("accessToken") || "")
                        }
                      >
                        <Avatar className="mr-2">
                          <AvatarFallback>{group.name[0]}</AvatarFallback>
                        </Avatar>
                        {group.name}
                      </Button>
                    ))}
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="w-3/4 flex flex-col">
            <CardHeader>
              <CardTitle>
                {selectedRecipient
                  ? `Chat with ${
                      users.find((u) => u.id === selectedRecipient)?.firstName || "User"
                    }`
                  : selectedGroup
                  ? `Group: ${groups.find((g) => g.id === selectedGroup)?.name || "Unknown"}`
                  : "Select a chat to start messaging"}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              <ScrollArea className="h-[calc(100vh-300px)]">
                {(selectedRecipient ? messages : groupMessages).map((msg) => (
                  <div
                    key={msg.id}
                    className={`mb-4 flex ${
                      msg.sender.id === userId ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        msg.sender.id === userId
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      <p>{msg.content}</p>
                      <span className="text-xs opacity-75">
                        {new Date(msg.sentAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </ScrollArea>
            </CardContent>
            {(selectedRecipient || selectedGroup) && (
              <div className="p-4 border-t flex gap-2">
                <Input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message (use @username for mentions)..."
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button onClick={handleSendMessage}>Send</Button>
              </div>
            )}
          </Card>
        </div>
      ) : (
        <div className="p-6">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p>You do not have permission to view chats.</p>
        </div>
      )}
    </>
  );
}

export default Chat;
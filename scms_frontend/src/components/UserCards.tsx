import { User } from "@/lib/api";

interface UserCardsProps {
  users: User[];
}

function UserCards({ users }: UserCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2">Total Users</h2>
        <p className="text-gray-600">All registered users in the system.</p>
        <div className="mt-4">
          <p className="text-2xl font-bold text-blue-600">{users.length}</p>
          <p className="text-sm text-gray-500">Users</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2">Active Admins</h2>
        <p className="text-gray-600">Currently active admin users.</p>
        <div className="mt-4">
          <p className="text-2xl font-bold text-green-600">
            {users.filter((u) => u.role.name === "Admin" && u.isActive).length}
          </p>
          <p className="text-sm text-gray-500">Active Admins</p>
        </div>
      </div>
    </div>
  );
}

export default UserCards;
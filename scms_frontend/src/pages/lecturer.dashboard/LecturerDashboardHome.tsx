import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";
import { lecturerService } from "../../lib/api";
import AssignedModules from "./components/AssignedModules";

const LecturerDashboardHome: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      try {
        jwtDecode(accessToken);
      } catch (err) {
        console.error("Failed to decode token:", err);
        setError("Invalid authentication token");
      }
    } else {
      setError("No authentication token found");
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container px-4 py-4 mx-4 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-2 text-center"
      >
      </motion.div>

      <div className="container mx-auto p-4">
        <AssignedModules />
      </div>
    </div>
  );
};

export default LecturerDashboardHome;

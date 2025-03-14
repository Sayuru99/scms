
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { resourceService } from "../../lib/api";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import ReservationStatisticsCard from "./components/ReservationStatisticsCard";
import ReservationsTable from "./components/ReservationsTable";
import ResourceGrid from "./components/ResourceGrid";

interface JwtPayload {
  userId: string;
  role: string;
  permissions: string[];
  exp: number;
}

function Reservation() {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      try {
        const decoded: JwtPayload = jwtDecode(accessToken);
        setPermissions(decoded.permissions || []);
        if (decoded.permissions.includes("read:courses")) {
          fetchEnrolledCourses(accessToken);
          fetchAvailableCourses(accessToken);
          fetchUpcomingExams();
        }
      } catch (err) {
        console.error("Failed to decode token:", err);
      }
    }
  }, []);

  const fetchEnrolledCourses = async (token: string) => {
    try {
      const data = await resourceService.getReservations(token);
      setEnrolledCourses(data.courses);
    } catch (err) {
      console.error("Failed to fetch enrolled courses:", err);
      toast.error("Failed to load enrolled courses");
    }
  };

  return (
    <div className="container px-4 py-4 mx-4 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-2 text-center"
      >
      </motion.div>

      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-2"
      >
        <ReservationStatisticsCard title="Active Reservations" value={enrolledCourses.length.toString()} />
        <ReservationStatisticsCard title="Next Resource Return In" value={"2h 38m"} />
        <ReservationStatisticsCard title="Cancellation Limit Left" value={"20"} />
        
      </motion.div>
     
      <div className="min-h-screen space-y-10 py-8">
      <ReservationsTable/>
      <ResourceGrid />
      </div>
    </div>
  );
}

export default Reservation;
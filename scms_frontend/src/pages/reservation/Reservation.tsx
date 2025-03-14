
import { motion } from "framer-motion";
import ReservationStatisticsCard from "./components/ReservationStatisticsCard";
import ReservationsTable from "./components/ReservationsTable";
import ResourceGrid from "./components/ResourceGrid";

function Reservation() {
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
        <ReservationStatisticsCard title="Active Reservations" value={"3"} />
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
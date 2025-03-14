import React from "react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

export interface ReservationStatisticsCardProps {
  title: string;
  value: string;
}

const ReservationStatisticsCard: React.FC<ReservationStatisticsCardProps> = ({
  title,
  value,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="course-card h-full flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-semibold mb-4">{title}</h3>
          
          <div className="flex items-center mb-1 text-xl font-bold text-blue-600">
            <span>{value}</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ReservationStatisticsCard;
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";
import StudentCourseCard from "./StudentCourseCard";
import { courseService } from "../../../lib/api";
import AssignedModules from "../AssignedModules";

interface Course {
  id: number;
  name: string;
  credits: number;
  modules?: Array<{
    id: number;
    name: string;
    code?: string;
    credits?: number;
    semester: string;
    isMandatory: boolean;
    lecturer?: { id: string };
  }>;
}

const LecturerDashboardHome: React.FC = () => {

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

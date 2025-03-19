import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MapPin, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { apiRequest } from "@/lib/api";
import Cookies from "js-cookie";

export interface ModuleClass {
  id: string;
  day: string;
  time: string;
  location: string;
}

interface ScheduleResponse {
  id: string;
  week: number;
  startTime: string;
  endTime: string;
  date: string;
  location: string | null;
  capacity: number;
  reservedBy: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
}

interface ModuleClassesProps {
  moduleTitle: string;
  moduleId: number;
  onClose: () => void;
}

// Function to convert 12-hour time format to 24-hour format
const convertTo24Hour = (time12h: string): string => {
  const [time, modifier] = time12h.split(' ');
  const [hoursStr, minutes] = time.split(':');
  let hours = parseInt(hoursStr);
  
  if (modifier === 'PM' && hours < 12) {
    hours = hours + 12;
  }
  if (modifier === 'AM' && hours === 12) {
    hours = 0;
  }
  
  return `${hours.toString().padStart(2, '0')}:${minutes}`;
};

const ModuleClasses: React.FC<ModuleClassesProps> = ({ moduleTitle, moduleId, onClose }) => {
  const [classes, setClasses] = useState<ModuleClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const token = Cookies.get("accessToken");
        if (!token) {
          setError("No authentication token found");
          return;
        }

        const response = await apiRequest<ScheduleResponse[]>(
          `/api/courses/${moduleId}/schedule`,
          "GET",
          undefined,
          token
        );

        // Transform the API response to match our ModuleClass interface
        const transformedClasses = response.map(cls => {
          // Convert times to 24-hour format
          const startTime24 = convertTo24Hour(cls.startTime);
          const endTime24 = convertTo24Hour(cls.endTime);

          // Combine date and time strings
          const startDateTime = new Date(`${cls.date}T${startTime24}`);
          const endDateTime = new Date(`${cls.date}T${endTime24}`);

          // Check if dates are valid
          if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
            console.error('Invalid date received:', cls);
            return {
              id: cls.id,
              day: 'Invalid Date',
              time: 'Invalid Time',
              location: cls.location || "Not specified"
            };
          }

          return {
            id: cls.id,
            day: startDateTime.toLocaleDateString('en-US', { weekday: 'long' }),
            time: `${startDateTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - ${endDateTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
            location: cls.location || "Not specified"
          };
        });

        setClasses(transformedClasses);
        setError(null);
      } catch (err) {
        console.error('Error fetching classes:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch classes');
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [moduleId]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">{moduleTitle} Classes</h3>
        <button
          onClick={onClose}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Close
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-32">
          <p className="text-red-500">{error}</p>
        </div>
      ) : classes.length === 0 ? (
        <div className="flex items-center justify-center h-32">
          <p className="text-muted-foreground">No classes scheduled for this module</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {classes.map((classItem) => (
            <Card key={classItem.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{classItem.day}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{classItem.time}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{classItem.location}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ModuleClasses; 
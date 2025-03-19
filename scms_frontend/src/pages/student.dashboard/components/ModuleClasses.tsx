import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MapPin, User, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { apiRequest } from "@/lib/api";
import Cookies from "js-cookie";

export interface ModuleClass {
  id: string;
  day: string;
  time: string;
  location: string;
  instructor: string;
}

interface ScheduleResponse {
  id: number;
  startTime: string;
  endTime: string;
  location: string | null;
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
        const transformedClasses = response.map(cls => ({
          id: cls.id.toString(),
          day: new Date(cls.startTime).toLocaleDateString('en-US', { weekday: 'long' }),
          time: `${new Date(cls.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - ${new Date(cls.endTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
          location: cls.location || "Not specified",
          instructor: cls.reservedBy ? `${cls.reservedBy.firstName} ${cls.reservedBy.lastName}` : "Not assigned"
        }));

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
                <div className="flex items-center text-sm text-muted-foreground">
                  <User className="h-4 w-4 mr-2" />
                  <span>{classItem.instructor}</span>
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
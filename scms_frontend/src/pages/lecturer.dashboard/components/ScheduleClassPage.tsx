import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { apiRequest } from '@/lib/api';

interface Schedule {
  id: string;
  week: number;
  startTime: string;
  endTime: string;
  location: string;
  capacity: number;
  date?: string;
}

interface ScheduleClassPageProps {
  moduleCode: string;
  moduleName: string;
  moduleId: string;
}

export function ScheduleClassPage({ moduleCode, moduleName, moduleId }: ScheduleClassPageProps) {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newSchedule, setNewSchedule] = useState<Partial<Schedule>>({
    week: 1,
    startTime: "09:00",
    endTime: "11:00",
    location: "",
    capacity: 30,
    date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("accessToken");
      if (!token) {
        setError("No authentication token found");
        return;
      }

      const response = await apiRequest<Schedule[]>(
        `/api/courses/${moduleId}/schedule`,
        "GET",
        undefined,
        token
      );

      // Sort schedules by date and reassign week numbers
      const sortedSchedules = [...response].sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.startTime}`);
        const dateB = new Date(`${b.date}T${b.startTime}`);
        return dateA.getTime() - dateB.getTime();
      });

      // Reassign week numbers starting from 1
      const processedSchedules = sortedSchedules.map((schedule, index) => ({
        ...schedule,
        week: index + 1
      }));

      setSchedules(processedSchedules);
      setError(null);
    } catch (err) {
      console.error('Error fetching schedules:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch schedules');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSchedule = async () => {
    if (!newSchedule.startTime || !newSchedule.endTime || !newSchedule.date) {
      toast.error("Please fill in all time fields");
      return;
    }

    try {
      const token = Cookies.get("accessToken");
      if (!token) {
        toast.error("No authentication token found");
        return;
      }

      // Calculate the week number based on chronological order
      const allDates = [...schedules.map(s => new Date(`${s.date}T${s.startTime}`)), 
                        new Date(`${newSchedule.date}T${newSchedule.startTime}`)];
      allDates.sort((a, b) => a.getTime() - b.getTime());
      const weekNumber = allDates.findIndex(date => 
        date.getTime() === new Date(`${newSchedule.date}T${newSchedule.startTime}`).getTime()
      ) + 1;

      const scheduleData = {
        week: weekNumber,
        startTime: `${newSchedule.date}T${newSchedule.startTime}:00.000Z`,
        endTime: `${newSchedule.date}T${newSchedule.endTime}:00.000Z`,
        location: newSchedule.location || null,
        capacity: newSchedule.capacity || 30
      };

      await apiRequest(
        `/api/courses/${moduleId}/schedule`,
        "POST",
        scheduleData,
        token,
        true
      );

      await fetchSchedules();
      setIsAddingNew(false);
      setNewSchedule({
        week: schedules.length + 1,
        startTime: "09:00",
        endTime: "11:00",
        location: "",
        capacity: 30,
        date: new Date().toISOString().split('T')[0]
      });
      toast.success("Schedule added successfully");
    } catch (err) {
      console.error('Error adding schedule:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to add schedule');
    }
  };

  const handleEditSchedule = (schedule: Schedule) => {
    setEditingSchedule(schedule);
  };

  const handleUpdateSchedule = async (updatedSchedule: Schedule) => {
    try {
      const token = Cookies.get("accessToken");
      if (!token) {
        toast.error("No authentication token found");
        return;
      }

      const scheduleData = {
        week: updatedSchedule.week,
        startTime: updatedSchedule.startTime,
        endTime: updatedSchedule.endTime,
        location: updatedSchedule.location,
        capacity: updatedSchedule.capacity
      };

      await apiRequest(
        `/api/courses/${moduleId}/schedule/${updatedSchedule.id}`,
        "PUT",
        scheduleData,
        token,
        true
      );

      await fetchSchedules();
      setEditingSchedule(null);
      toast.success("Schedule updated successfully");
    } catch (err) {
      console.error('Error updating schedule:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to update schedule');
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    try {
      const token = Cookies.get("accessToken");
      if (!token) {
        toast.error("No authentication token found");
        return;
      }

      await apiRequest(
        `/api/courses/${moduleId}/schedule/${id}`,
        "DELETE",
        undefined,
        token,
        true
      );

      await fetchSchedules();
      toast.success("Schedule deleted successfully");
    } catch (err) {
      console.error('Error deleting schedule:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to delete schedule');
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">
          Schedule for {moduleCode} - {moduleName}
        </h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {schedules.map((schedule) => (
            <Card key={schedule.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl">Week {schedule.week}</CardTitle>
                <div className="flex gap-2">
                  <Badge variant="secondary">Scheduled</Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditSchedule(schedule)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteSchedule(schedule.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {editingSchedule?.id === schedule.id ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={editingSchedule.date || new Date().toISOString().split('T')[0]}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingSchedule({
                          ...editingSchedule,
                          date: e.target.value
                        })}
                      />
                    </div>
                    <div>
                      <Label>Start Time</Label>
                      <Input
                        type="time"
                        value={editingSchedule.startTime}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingSchedule({
                          ...editingSchedule,
                          startTime: e.target.value
                        })}
                      />
                    </div>
                    <div>
                      <Label>End Time</Label>
                      <Input
                        type="time"
                        value={editingSchedule.endTime}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingSchedule({
                          ...editingSchedule,
                          endTime: e.target.value
                        })}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Location</Label>
                      <div className="flex gap-2">
                        <Input
                          value={editingSchedule.location}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingSchedule({
                            ...editingSchedule,
                            location: e.target.value
                          })}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                        >
                          Reserve
                        </Button>
                      </div>
                    </div>
                    <div className="col-span-2 flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setEditingSchedule(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleUpdateSchedule(editingSchedule)}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Date</p>
                      <p className="text-lg">{schedule.date}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Time</p>
                      <p className="text-lg">
                        {schedule.startTime} - {schedule.endTime}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm font-medium text-muted-foreground">Location</p>
                      <div className="flex items-center gap-2">
                        <p className="text-lg">{schedule.location || "Not specified"}</p>
                        <Button
                          variant="outline"
                          size="sm"
                        >
                          Reserve
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {isAddingNew ? (
            <Card>
              <CardHeader>
                <CardTitle>Add New Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Week</Label>
                    <Input
                      type="number"
                      value={newSchedule.week}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewSchedule({
                        ...newSchedule,
                        week: parseInt(e.target.value)
                      })}
                    />
                  </div>
                  <div>
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={newSchedule.date}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewSchedule({
                        ...newSchedule,
                        date: e.target.value
                      })}
                    />
                  </div>
                  <div>
                    <Label>Start Time</Label>
                    <Input
                      type="time"
                      value={newSchedule.startTime}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewSchedule({
                        ...newSchedule,
                        startTime: e.target.value
                      })}
                    />
                  </div>
                  <div>
                    <Label>End Time</Label>
                    <Input
                      type="time"
                      value={newSchedule.endTime}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewSchedule({
                        ...newSchedule,
                        endTime: e.target.value
                      })}
                    />
                  </div>
                  <div>
                    <Label>Location</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newSchedule.location}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewSchedule({
                          ...newSchedule,
                          location: e.target.value
                        })}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                      >
                        Reserve
                      </Button>
                    </div>
                  </div>
                  <div className="col-span-2 flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsAddingNew(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddSchedule}>
                      Add Schedule
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsAddingNew(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Schedule
            </Button>
          )}
        </div>
      )}
    </div>
  );
} 
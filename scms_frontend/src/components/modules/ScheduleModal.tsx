import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Schedule {
  id: string;
  week: number;
  startTime: string;
  endTime: string;
  location: string;
}

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  moduleCode: string;
  moduleName: string;
}

// Static schedule data - replace with actual data in production
const initialSchedules: Schedule[] = [
  {
    id: "1",
    week: 1,
    startTime: "09:00 AM",
    endTime: "11:00 AM",
    location: "Room 101"
  },
  {
    id: "2",
    week: 2,
    startTime: "09:00 AM",
    endTime: "11:00 AM",
    location: "Room 101"
  },
  {
    id: "3",
    week: 3,
    startTime: "09:00 AM",
    endTime: "11:00 AM",
    location: "Room 102"
  }
];

export function ScheduleModal({ isOpen, onClose, moduleCode, moduleName }: ScheduleModalProps) {
  const [schedules, setSchedules] = useState<Schedule[]>(initialSchedules);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newSchedule, setNewSchedule] = useState<Partial<Schedule>>({
    week: schedules.length + 1,
    startTime: "09:00 AM",
    endTime: "11:00 AM",
    location: ""
  });

  const handleAddSchedule = () => {
    if (!newSchedule.location) return;
    
    const schedule: Schedule = {
      id: Date.now().toString(),
      week: newSchedule.week || schedules.length + 1,
      startTime: newSchedule.startTime || "09:00 AM",
      endTime: newSchedule.endTime || "11:00 AM",
      location: newSchedule.location
    };

    setSchedules([...schedules, schedule]);
    setIsAddingNew(false);
    setNewSchedule({
      week: schedules.length + 2,
      startTime: "09:00 AM",
      endTime: "11:00 AM",
      location: ""
    });
  };

  const handleEditSchedule = (schedule: Schedule) => {
    setEditingSchedule(schedule);
  };

  const handleUpdateSchedule = (updatedSchedule: Schedule) => {
    setSchedules(schedules.map(s => 
      s.id === updatedSchedule.id ? updatedSchedule : s
    ));
    setEditingSchedule(null);
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedules(schedules.filter(s => s.id !== id));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            Schedule for {moduleCode} - {moduleName}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
                      <Label>Start Time</Label>
                      <Input
                        type="time"
                        value={editingSchedule.startTime}
                        onChange={(e) => setEditingSchedule({
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
                        onChange={(e) => setEditingSchedule({
                          ...editingSchedule,
                          endTime: e.target.value
                        })}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Location</Label>
                      <Input
                        value={editingSchedule.location}
                        onChange={(e) => setEditingSchedule({
                          ...editingSchedule,
                          location: e.target.value
                        })}
                      />
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
                      <p className="text-sm font-medium text-muted-foreground">Time</p>
                      <p className="text-lg">
                        {schedule.startTime} - {schedule.endTime}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Location</p>
                      <p className="text-lg">{schedule.location}</p>
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
                      onChange={(e) => setNewSchedule({
                        ...newSchedule,
                        week: parseInt(e.target.value)
                      })}
                    />
                  </div>
                  <div>
                    <Label>Start Time</Label>
                    <Input
                      type="time"
                      value={newSchedule.startTime}
                      onChange={(e) => setNewSchedule({
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
                      onChange={(e) => setNewSchedule({
                        ...newSchedule,
                        endTime: e.target.value
                      })}
                    />
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Input
                      value={newSchedule.location}
                      onChange={(e) => setNewSchedule({
                        ...newSchedule,
                        location: e.target.value
                      })}
                    />
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
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 
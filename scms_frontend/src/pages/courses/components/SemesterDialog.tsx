import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SemesterType } from './CourseBuilder';

type SemesterDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddSemester: (name: string) => void;
  editingSemester: SemesterType | null;
};

const SemesterDialog: React.FC<SemesterDialogProps> = ({ 
  open, 
  onOpenChange, 
  onAddSemester,
  editingSemester
}) => {
  const [semesterName, setSemesterName] = useState("");

  useEffect(() => {
    if (editingSemester) {
      setSemesterName(editingSemester.name);
    } else {
      setSemesterName("");
    }
  }, [editingSemester]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (semesterName.trim()) {
      onAddSemester(semesterName);
      setSemesterName("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {editingSemester ? 'Edit Semester' : 'Add New Semester'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="semesterName">Semester Name</Label>
            <Input 
              id="semesterName" 
              placeholder="e.g. Semester 1, Fall 2023, etc."
              value={semesterName}
              onChange={(e) => setSemesterName(e.target.value)}
              className="w-full"
              autoFocus
            />
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!semesterName.trim()}>
              {editingSemester ? 'Update Semester' : 'Add Semester'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SemesterDialog;
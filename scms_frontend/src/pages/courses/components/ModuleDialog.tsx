import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type ModuleDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddModule: (module: {
    title: string;
    code: string;
    credits: number;
    isMandatory: boolean;
  }) => void;
};

const ModuleDialog: React.FC<ModuleDialogProps> = ({ 
  open, 
  onOpenChange,
  onAddModule 
}) => {
  const [moduleData, setModuleData] = useState({
    title: "",
    code: "",
    credits: 3,
    isMandatory: true
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setModuleData(prev => ({
      ...prev,
      [name]: name === 'credits' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (moduleData.title.trim() && moduleData.code.trim()) {
      onAddModule(moduleData);
      setModuleData({
        title: "",
        code: "",
        credits: 3,
        isMandatory: true
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add New Module</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="moduleTitle">Module Title</Label>
              <Input 
                id="moduleTitle" 
                name="title"
                placeholder="e.g. Introduction to Programming"
                value={moduleData.title}
                onChange={handleChange}
                className="w-full"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="moduleCode">Module Code</Label>
              <Input 
                id="moduleCode" 
                name="code"
                placeholder="e.g. CS101"
                value={moduleData.code}
                onChange={handleChange}
                className="w-full"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="moduleCredits">Credits</Label>
            <Input 
              id="moduleCredits" 
              name="credits"
              type="number"
              min={1}
              max={50}
              value={moduleData.credits}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label>Module Type</Label>
            <RadioGroup 
              value={moduleData.isMandatory ? "mandatory" : "optional"}
              onValueChange={(value) => setModuleData(prev => ({ 
                ...prev, 
                isMandatory: value === "mandatory" 
              }))}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mandatory" id="mandatory" />
                <Label htmlFor="mandatory" className="cursor-pointer">Mandatory</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="optional" id="optional" />
                <Label htmlFor="optional" className="cursor-pointer">Optional</Label>
              </div>
            </RadioGroup>
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!moduleData.title.trim() || !moduleData.code.trim()}
            >
              Add Module
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModuleDialog;
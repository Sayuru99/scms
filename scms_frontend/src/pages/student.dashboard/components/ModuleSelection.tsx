import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ModuleClasses from "./ModuleClasses";

export interface Module {
  id: string;
  title: string;
  credits: number;
  schedule: string;
  actionType: "view" | "register";
}

interface ModuleSelectionProps {
  title: string;
  semesters: {
    id: string;
    name: string;
    modules: Module[];
  }[];
}

const ModuleSelection: React.FC<ModuleSelectionProps> = ({ title, semesters }) => {
  const [activeTab, setActiveTab] = useState(semesters[0]?.id || "");
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);

  const handleModuleAction = (module: Module, actionType: string) => {
    if (actionType === "view") {
      setSelectedModule(module);
    } else {
      console.log(`Register action for module ${module.id}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
      className="tab-container"
    >
      <div className="p-6 border-b border-gray-300">
        <h2 className="text-2xl font-semibold">{title}</h2>
      </div>
      
      <AnimatePresence mode="wait">
        {selectedModule ? (
          <motion.div
            key="module-classes"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6"
          >
            <ModuleClasses
              moduleTitle={selectedModule.title}
              moduleId={parseInt(selectedModule.id)}
              onClose={() => setSelectedModule(null)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="module-list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-flow-col auto-cols-fr p-0 rounded-none border-b border-gray-300 h-auto">
                {semesters.map((semester) => (
                  <TabsTrigger
                    key={semester.id}
                    value={semester.id}
                    className="py-3 rounded-none data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground transition-all"
                  >
                    {semester.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {semesters.map((semester) => (
                <TabsContent key={semester.id} value={semester.id} className="p-0 mt-0">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={semester.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {semester.modules.map((module) => (
                        <div key={module.id} className="module-item p-6 border-b border-gray-200">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="font-medium mb-2">{module.title}</h3>
                              <p className="text-sm text-muted-foreground mb-1">Credits: {module.credits}</p>
                              {/* <div className="flex items-center text-sm text-muted-foreground">
                                <Clock className="h-3.5 w-3.5 mr-1.5" />
                                <span>Classes: {module.schedule}</span>
                              </div> */}
                            </div>
                            
                            <Button
                              onClick={() => handleModuleAction(module, module.actionType)}
                              variant={module.actionType === "register" ? "default" : "secondary"}
                              size="sm"
                              className="shrink-0 self-end sm:self-center"
                            >
                              {module.actionType === "register" ? "Register" : "View"}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </TabsContent>
              ))}
            </Tabs>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ModuleSelection;
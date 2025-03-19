import React from "react";
import { Card } from "@/components/ui/card";
import { Clock, Book, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export interface StudentCourseCardProps {
  title: string;
  duration: string;
  modules: number;
  onClick: () => void;
  isPrimary?: boolean;
}

const StudentCourseCard: React.FC<StudentCourseCardProps> = ({
  title,
  duration,
  modules,
  onClick,
  isPrimary = false,
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
          <h3 className="text-xl font-semibold mb-4">{title}</h3>
          
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <Clock className="size-4 mr-2" />
            <span>Credits: {duration}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Book className="size-4 mr-2" />
            <span>{modules} Modules</span>
          </div>
        </div>
        
        <div className="mt-6">
          <Button 
            onClick={onClick}
            variant={isPrimary ? "default" : "secondary"}
            className="w-full group"
          >
            <span>View Details</span>
            <ArrowRight className="ml-2 size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default StudentCourseCard;
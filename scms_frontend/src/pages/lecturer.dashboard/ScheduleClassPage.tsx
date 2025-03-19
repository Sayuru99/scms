import { useParams } from 'react-router-dom';
import { ScheduleClassPage as ScheduleClassPageComponent } from './components/ScheduleClassPage';
import { useState, useEffect } from 'react';
import { Module, lecturerService } from '@/lib/api';
import Cookies from "js-cookie";
import { Loader2 } from "lucide-react";

export default function ScheduleClassPage() {
  const { moduleId } = useParams();
  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModule = async () => {
      try {
        const token = Cookies.get("accessToken");
        if (!token || !moduleId) {
          setError("No authentication token or module ID found");
          return;
        }
        const response = await lecturerService.getAssignedModules(token);
        if (response && Array.isArray(response.modules)) {
          const foundModule = response.modules.find(m => m.id === parseInt(moduleId));
          if (foundModule) {
            setModule(foundModule);
          } else {
            setError("Module not found");
          }
        } else {
          setError('Invalid response format from server');
        }
      } catch (err) {
        console.error('Error fetching module:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch module');
      } finally {
        setLoading(false);
      }
    };

    fetchModule();
  }, [moduleId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !module) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">{error || "Module not found"}</p>
      </div>
    );
  }

  return (
    <ScheduleClassPageComponent
      moduleCode={module.code || ''}
      moduleName={module.name}
      moduleId={module.id}
    />
  );
} 
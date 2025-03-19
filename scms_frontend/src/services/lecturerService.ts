import { apiRequest } from '../lib/api';

export interface AssignedModule {
  id: number;
  name: string;
  code: string;
  semester: string;
  credits: number;
  isMandatory: boolean;
  course: {
    id: number;
    code: string;
    name: string;
  };
}

export const lecturerService = {
  getAssignedModules: (lecturerId: string, token: string) =>
    apiRequest<{ modules: AssignedModule[] }>(
      `/api/lecturers/${lecturerId}/modules`,
      'GET',
      undefined,
      token
    ),
}; 
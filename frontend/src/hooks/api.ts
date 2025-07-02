import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Project } from '@/types';

// Projects hooks
export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: () => apiClient.getProjects(),
  });
};

export const useProject = (id: number) => {
  return useQuery({
    queryKey: ['project', id],
    queryFn: () => apiClient.getProject(id),
    enabled: !!id,
  });
};

export const useAdminProjects = () => {
  return useQuery({
    queryKey: ['admin-projects'],
    queryFn: () => apiClient.getAdminProjects(),
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (project: Partial<Project>) => apiClient.createProject(project),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, project }: { id: number; project: Partial<Project> }) =>
      apiClient.updateProject(id, project),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => apiClient.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
    },
  });
};

// Auth hooks
export const useLogin = () => {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      apiClient.login(email, password),
  });
};

// Contact hooks
export const useSubmitContact = () => {
  return useMutation({
    mutationFn: (contact: { name: string; email: string; message: string }) =>
      apiClient.submitContact(contact),
  });
};


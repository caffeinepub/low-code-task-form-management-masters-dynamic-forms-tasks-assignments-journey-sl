import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { Task } from '../../backend';
import { getErrorMessage } from '../../utils/getErrorMessage';

// Re-export Task type for use in other components
export type { Task };

export type TaskDefinition = {
  id: string;
  name: string;
  description: string;
  attachedForms: Array<{ formId: string; version?: bigint }>;
  slaMinutes?: bigint;
  escalationThresholdMinutes?: bigint;
  created: bigint;
  lastUpdated: bigint;
};

// Note: Backend Task type is already imported from backend.d.ts
// We'll use it directly instead of redefining

export function useGetMyTasks() {
  const { actor, isFetching } = useActor();
  return useQuery<Task[]>({
    queryKey: ['myTasks'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getMyTasks();
      } catch (error) {
        console.error('Failed to fetch my tasks:', error);
        throw new Error(getErrorMessage(error));
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetDepartmentPoolTasks() {
  const { actor, isFetching } = useActor();
  return useQuery<Task[]>({
    queryKey: ['departmentPoolTasks'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAssignedTasks();
      } catch (error) {
        console.error('Failed to fetch department pool tasks:', error);
        throw new Error(getErrorMessage(error));
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetTask(taskId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Task | null>({
    queryKey: ['task', taskId],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getTask(taskId);
      } catch (error) {
        console.error('Failed to fetch task:', error);
        throw new Error(getErrorMessage(error));
      }
    },
    enabled: !!actor && !isFetching && !!taskId,
  });
}

export function useCreateTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (task: Task) => {
      if (!actor) throw new Error('Actor not available');
      try {
        await actor.createTask(task);
        return task.id;
      } catch (error) {
        console.error('Failed to create task:', error);
        throw new Error(getErrorMessage(error));
      }
    },
    onSuccess: (taskId) => {
      queryClient.invalidateQueries({ queryKey: ['myTasks'] });
      queryClient.invalidateQueries({ queryKey: ['departmentPoolTasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
    },
  });
}

export function useUpdateTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, task }: { id: string; task: Task }) => {
      if (!actor) throw new Error('Actor not available');
      try {
        await actor.updateTask(id, task);
      } catch (error) {
        console.error('Failed to update task:', error);
        throw new Error(getErrorMessage(error));
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['task', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['myTasks'] });
      queryClient.invalidateQueries({ queryKey: ['departmentPoolTasks'] });
    },
  });
}

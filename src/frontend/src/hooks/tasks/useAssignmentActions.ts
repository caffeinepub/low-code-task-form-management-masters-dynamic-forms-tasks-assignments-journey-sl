import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';

export function usePickupTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      if (!actor) throw new Error('Actor not available');
      // Backend needs: pickupTask(taskId) mutation
      return;
    },
    onSuccess: (_, taskId) => {
      queryClient.invalidateQueries({ queryKey: ['departmentPoolTasks'] });
      queryClient.invalidateQueries({ queryKey: ['myTasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      queryClient.invalidateQueries({ queryKey: ['taskJourney', taskId] });
    },
  });
}

export function useReassignTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      assignmentType,
      assignmentValue,
    }: {
      taskId: string;
      assignmentType: 'department' | 'user';
      assignmentValue: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      // Backend needs: reassignTask mutation
      return;
    },
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ['myTasks'] });
      queryClient.invalidateQueries({ queryKey: ['departmentPoolTasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      queryClient.invalidateQueries({ queryKey: ['taskJourney', taskId] });
    },
  });
}

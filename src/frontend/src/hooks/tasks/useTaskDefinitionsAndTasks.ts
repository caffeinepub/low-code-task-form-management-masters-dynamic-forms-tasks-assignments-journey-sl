import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';

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

export type Task = {
  id: string;
  definitionId: string;
  taskType: string;
  priority: string;
  status: string;
  owner: string;
  assignment?: { type: 'department' | 'user'; value: string };
  createdDate: bigint;
  dueDate: bigint;
  completionDate?: bigint;
  attachedForms: string[];
  formCompletionStatus: Array<{ formId: string; completed: boolean }>;
  slaStatus?: 'onTrack' | 'atRisk' | 'breached';
};

export function useGetTaskDefinitions() {
  const { actor, isFetching } = useActor();
  return useQuery<TaskDefinition[]>({
    queryKey: ['taskDefinitions'],
    queryFn: async () => {
      if (!actor) return [];
      // Backend needs: getAllTaskDefinitions query method
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMyTasks() {
  const { actor, isFetching } = useActor();
  return useQuery<Task[]>({
    queryKey: ['myTasks'],
    queryFn: async () => {
      if (!actor) return [];
      // Backend needs: getMyTasks query method
      return [];
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
      // Backend needs: getDepartmentPoolTasks query method
      return [];
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
      // Backend needs: getTask(taskId) query method
      return null;
    },
    enabled: !!actor && !isFetching && !!taskId,
  });
}

export function useCreateTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (task: Omit<Task, 'id' | 'createdDate' | 'formCompletionStatus'>) => {
      if (!actor) throw new Error('Actor not available');
      // Backend needs: createTask mutation
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myTasks'] });
      queryClient.invalidateQueries({ queryKey: ['departmentPoolTasks'] });
    },
  });
}

export function useCreateTaskDefinition() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (definition: Omit<TaskDefinition, 'id' | 'created' | 'lastUpdated'>) => {
      if (!actor) throw new Error('Actor not available');
      // Backend needs: createTaskDefinition mutation
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskDefinitions'] });
    },
  });
}

export function useUpdateTaskDefinition() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, definition }: { id: string; definition: TaskDefinition }) => {
      if (!actor) throw new Error('Actor not available');
      // Backend needs: updateTaskDefinition mutation
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskDefinitions'] });
    },
  });
}

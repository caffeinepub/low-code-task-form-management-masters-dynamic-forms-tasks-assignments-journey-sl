import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type {
  Department,
  Category,
  Status,
  Priority,
  TaskType,
  MasterList,
} from '../../backend';

// Query hooks - these would need backend query methods
export function useGetDepartments() {
  const { actor, isFetching } = useActor();
  return useQuery<Department[]>({
    queryKey: ['departments'],
    queryFn: async () => {
      if (!actor) return [];
      // Backend needs: getAllDepartments query method
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCategories() {
  const { actor, isFetching } = useActor();
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      if (!actor) return [];
      // Backend needs: getAllCategories query method
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetStatuses() {
  const { actor, isFetching } = useActor();
  return useQuery<Status[]>({
    queryKey: ['statuses'],
    queryFn: async () => {
      if (!actor) return [];
      // Backend needs: getAllStatuses query method
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPriorities() {
  const { actor, isFetching } = useActor();
  return useQuery<Priority[]>({
    queryKey: ['priorities'],
    queryFn: async () => {
      if (!actor) return [];
      // Backend needs: getAllPriorities query method
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetTaskTypes() {
  const { actor, isFetching } = useActor();
  return useQuery<TaskType[]>({
    queryKey: ['taskTypes'],
    queryFn: async () => {
      if (!actor) return [];
      // Backend needs: getAllTaskTypes query method
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMasterLists() {
  const { actor, isFetching } = useActor();
  return useQuery<MasterList[]>({
    queryKey: ['masterLists'],
    queryFn: async () => {
      if (!actor) return [];
      // Backend needs: getAllMasterLists query method
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

// Mutation hooks
export function useCreateDepartment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (department: Department) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createDepartment(department);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });
}

export function useUpdateDepartment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, department }: { id: string; department: Department }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateDepartment(id, department);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });
}

export function useDeleteDepartment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteDepartment(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });
}

export function useCreateCategory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (category: Category) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createCategory(category);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useUpdateCategory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, category }: { id: string; category: Category }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateCategory(id, category);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useDeleteCategory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteCategory(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useCreateStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (status: Status) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createStatus(status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['statuses'] });
    },
  });
}

export function useUpdateStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Status }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['statuses'] });
    },
  });
}

export function useDeleteStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteStatus(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['statuses'] });
    },
  });
}

export function useCreatePriority() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (priority: Priority) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createPriority(priority);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['priorities'] });
    },
  });
}

export function useUpdatePriority() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, priority }: { id: string; priority: Priority }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updatePriority(id, priority);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['priorities'] });
    },
  });
}

export function useDeletePriority() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deletePriority(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['priorities'] });
    },
  });
}

export function useCreateTaskType() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskType: TaskType) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createTaskType(taskType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskTypes'] });
    },
  });
}

export function useUpdateTaskType() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, taskType }: { id: string; taskType: TaskType }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateTaskType(id, taskType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskTypes'] });
    },
  });
}

export function useDeleteTaskType() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteTaskType(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskTypes'] });
    },
  });
}

export function useCreateMasterList() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (masterList: MasterList) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createMasterList(masterList);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['masterLists'] });
    },
  });
}

export function useUpdateMasterList() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, masterList }: { id: string; masterList: MasterList }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateMasterList(id, masterList);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['masterLists'] });
    },
  });
}

export function useDeleteMasterList() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteMasterList(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['masterLists'] });
    },
  });
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { TaskType, Priority, Status, Department, Category, MasterList } from '../../backend';
import { getErrorMessage } from '../../utils/getErrorMessage';

// Task Types
export function useGetTaskTypes() {
  const { actor, isFetching } = useActor();
  return useQuery<TaskType[]>({
    queryKey: ['taskTypes'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getTaskTypes();
      } catch (error) {
        console.error('Failed to fetch task types:', error);
        throw new Error(getErrorMessage(error));
      }
    },
    enabled: !!actor && !isFetching,
  });
}

// Priorities
export function useGetPriorities() {
  const { actor, isFetching } = useActor();
  return useQuery<Priority[]>({
    queryKey: ['priorities'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getPriorities();
      } catch (error) {
        console.error('Failed to fetch priorities:', error);
        throw new Error(getErrorMessage(error));
      }
    },
    enabled: !!actor && !isFetching,
  });
}

// Statuses
export function useGetStatuses() {
  const { actor, isFetching } = useActor();
  return useQuery<Status[]>({
    queryKey: ['statuses'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getStatuses();
      } catch (error) {
        console.error('Failed to fetch statuses:', error);
        throw new Error(getErrorMessage(error));
      }
    },
    enabled: !!actor && !isFetching,
  });
}

// Departments
export function useGetDepartments() {
  const { actor, isFetching } = useActor();
  return useQuery<Department[]>({
    queryKey: ['departments'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getDepartments();
      } catch (error) {
        console.error('Failed to fetch departments:', error);
        throw new Error(getErrorMessage(error));
      }
    },
    enabled: !!actor && !isFetching,
  });
}

// Categories
export function useGetCategories() {
  const { actor, isFetching } = useActor();
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getCategories();
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        throw new Error(getErrorMessage(error));
      }
    },
    enabled: !!actor && !isFetching,
  });
}

// Master Lists
export function useGetMasterLists() {
  const { actor, isFetching } = useActor();
  return useQuery<MasterList[]>({
    queryKey: ['masterLists'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getMasterLists();
      } catch (error) {
        console.error('Failed to fetch master lists:', error);
        throw new Error(getErrorMessage(error));
      }
    },
    enabled: !!actor && !isFetching,
  });
}

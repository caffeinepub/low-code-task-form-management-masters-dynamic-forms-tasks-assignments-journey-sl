import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { FormDefinition } from '../../backend';

export function useGetFormDefinitions() {
  const { actor, isFetching } = useActor();
  return useQuery<FormDefinition[]>({
    queryKey: ['formDefinitions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFormDefinitions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetFormDefinition(id: string) {
  const { actor, isFetching } = useActor();
  return useQuery<FormDefinition | null>({
    queryKey: ['formDefinition', id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getFormDefinition(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useCreateFormDefinition() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formDefinition: FormDefinition) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createFormDefinition(formDefinition);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['formDefinitions'] });
    },
  });
}

export function useUpdateFormDefinition() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, formDefinition }: { id: string; formDefinition: FormDefinition }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateFormDefinition(id, formDefinition);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['formDefinitions'] });
      queryClient.invalidateQueries({ queryKey: ['formDefinition', variables.id] });
    },
  });
}

export function useDeleteFormDefinition() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteFormDefinition(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['formDefinitions'] });
    },
  });
}

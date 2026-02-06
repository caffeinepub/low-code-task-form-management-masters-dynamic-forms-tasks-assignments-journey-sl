import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';

export type FormSubmission = {
  id: string;
  taskId: string;
  formId: string;
  formVersion: bigint;
  submittedBy: string;
  submittedAt: bigint;
  data: Record<string, any>;
};

export function useGetTaskSubmissions(taskId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<FormSubmission[]>({
    queryKey: ['taskSubmissions', taskId],
    queryFn: async () => {
      if (!actor) return [];
      // Backend needs: getTaskSubmissions(taskId) query method
      return [];
    },
    enabled: !!actor && !isFetching && !!taskId,
  });
}

export function useGetSubmission(submissionId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<FormSubmission | null>({
    queryKey: ['submission', submissionId],
    queryFn: async () => {
      if (!actor) return null;
      // Backend needs: getSubmission(submissionId) query method
      return null;
    },
    enabled: !!actor && !isFetching && !!submissionId,
  });
}

export function useSubmitForm() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (submission: Omit<FormSubmission, 'id' | 'submittedAt'>) => {
      if (!actor) throw new Error('Actor not available');
      // Backend needs: submitForm mutation
      return;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['taskSubmissions', variables.taskId] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

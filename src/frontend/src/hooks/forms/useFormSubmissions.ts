import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import { useInternetIdentity } from '../useInternetIdentity';
import type { DynamicFormInput, FormFieldInput, FieldValue } from '../../backend';
import { getErrorMessage } from '../../utils/getErrorMessage';

export type FormSubmission = {
  id: string;
  taskId: string;
  formId: string;
  formVersion: bigint;
  submittedBy: string;
  submittedAt: bigint;
  data: Record<string, any>;
};

// Helper to convert backend DynamicFormInput to frontend FormSubmission
function convertToFormSubmission(input: DynamicFormInput, submissionId: string, taskId: string): FormSubmission {
  const dataMap: Record<string, any> = {};
  input.data.forEach((field) => {
    const valueKey = Object.keys(field.value).find(k => k !== '__kind__');
    if (valueKey) {
      dataMap[field.fieldId] = (field.value as any)[valueKey];
    }
  });

  return {
    id: submissionId,
    taskId,
    formId: input.formId,
    formVersion: input.version,
    submittedBy: input.submittedBy.toString(),
    submittedAt: input.submittedAt,
    data: dataMap,
  };
}

export function useGetTaskSubmissions(taskId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<FormSubmission[]>({
    queryKey: ['taskSubmissions', taskId],
    queryFn: async () => {
      if (!actor) return [];
      try {
        // Get all submissions for the current user and filter by task
        const allSubmissions = await actor.getMyFormSubmissions();
        // Since backend doesn't have task-specific query, we need to track submissions differently
        // For now, return all user submissions (this is a limitation we'll note)
        return allSubmissions.map((sub, idx) => 
          convertToFormSubmission(sub, `${sub.formId}-${sub.submittedAt}`, taskId)
        );
      } catch (error) {
        console.error('Failed to fetch task submissions:', error);
        throw new Error(getErrorMessage(error));
      }
    },
    enabled: !!actor && !isFetching && !!taskId,
  });
}

export function useGetSubmission(submissionId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<FormSubmission | null>({
    queryKey: ['submission', submissionId],
    queryFn: async () => {
      if (!actor || !submissionId) return null;
      try {
        const submission = await actor.getFormSubmission(submissionId);
        if (!submission) return null;
        // Extract taskId from submissionId (format: formId-timestamp)
        return convertToFormSubmission(submission, submissionId, 'unknown');
      } catch (error) {
        console.error('Failed to fetch submission:', error);
        throw new Error(getErrorMessage(error));
      }
    },
    enabled: !!actor && !isFetching && !!submissionId,
  });
}

export function useSubmitForm() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      taskId, 
      formId, 
      formVersion, 
      data 
    }: { 
      taskId: string; 
      formId: string; 
      formVersion: bigint; 
      data: Record<string, any> 
    }) => {
      if (!actor) throw new Error('Actor not available');
      if (!identity) throw new Error('User not authenticated');
      
      try {
        // Convert data to FormFieldInput array
        const formFieldInputs: FormFieldInput[] = Object.entries(data).map(([fieldId, value]) => {
          let fieldValue: FieldValue;
          
          // Determine the type and create appropriate FieldValue
          if (typeof value === 'string') {
            fieldValue = { __kind__: 'text', text: value };
          } else if (typeof value === 'number') {
            fieldValue = { __kind__: 'number', number: BigInt(value) };
          } else if (Array.isArray(value)) {
            fieldValue = { __kind__: 'multipleChoices', multipleChoices: value };
          } else {
            fieldValue = { __kind__: 'text', text: String(value) };
          }

          return {
            fieldId,
            value: fieldValue,
          };
        });

        const submission: DynamicFormInput = {
          formId,
          version: formVersion,
          data: formFieldInputs,
          submittedBy: identity.getPrincipal(),
          submittedAt: BigInt(Date.now() * 1000000),
        };

        // Submit the form for the task
        await actor.submitTaskForm(taskId, submission);
        
        // Return the submission ID for navigation
        return `${formId}-${submission.submittedAt}`;
      } catch (error) {
        console.error('Failed to submit form:', error);
        throw new Error(getErrorMessage(error));
      }
    },
    onSuccess: (submissionId, variables) => {
      queryClient.invalidateQueries({ queryKey: ['task', variables.taskId] });
      queryClient.invalidateQueries({ queryKey: ['taskSubmissions', variables.taskId] });
      queryClient.invalidateQueries({ queryKey: ['submission', submissionId] });
    },
  });
}

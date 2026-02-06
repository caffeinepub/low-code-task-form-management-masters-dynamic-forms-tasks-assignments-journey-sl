import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useGetFormDefinition } from '../../hooks/forms/useFormDefinitions';
import { useSubmitForm } from '../../hooks/forms/useFormSubmissions';
import DynamicFormRenderer from '../forms/DynamicFormRenderer';
import { toast } from 'sonner';
import { getErrorMessage } from '../../utils/getErrorMessage';

type TaskFormSubmitDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId: string;
  formId: string;
  onSuccess: () => void;
};

export default function TaskFormSubmitDialog({
  open,
  onOpenChange,
  taskId,
  formId,
  onSuccess,
}: TaskFormSubmitDialogProps) {
  const { data: formDefinition, isLoading } = useGetFormDefinition(formId);
  const submitForm = useSubmitForm();

  const handleSubmit = async (data: Record<string, any>) => {
    if (!formDefinition) {
      toast.error('Form definition not found');
      return;
    }

    try {
      await submitForm.mutateAsync({
        taskId,
        formId,
        formVersion: formDefinition.version,
        data,
      });
      toast.success('Form submitted successfully');
      onSuccess();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Fill Form</DialogTitle>
          <DialogDescription>
            Complete the form fields below and submit to mark this form as completed for the task.
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">Loading form...</div>
        ) : !formDefinition ? (
          <div className="py-8 text-center text-muted-foreground">Form not found</div>
        ) : (
          <DynamicFormRenderer
            formDefinition={formDefinition}
            onSubmit={handleSubmit}
            isSubmitting={submitForm.isPending}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

import { useParams, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import SubmissionValueViewer from '../../components/forms/SubmissionValueViewer';
import { useGetSubmission } from '../../hooks/forms/useFormSubmissions';
import { useGetFormDefinition } from '../../hooks/forms/useFormDefinitions';

export default function FormSubmissionViewPage() {
  const { taskId, submissionId } = useParams({ from: '/tasks/$taskId/submissions/$submissionId' });
  const navigate = useNavigate();
  const { data: submission, isLoading: submissionLoading } = useGetSubmission(submissionId);
  const { data: formDefinition, isLoading: formLoading } = useGetFormDefinition(submission?.formId || '');

  if (submissionLoading || formLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-muted-foreground">Loading submission...</div>
      </div>
    );
  }

  if (!submission || !formDefinition) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-muted-foreground mb-4">Submission not found</div>
          <Button onClick={() => navigate({ to: `/tasks/${taskId}` })}>Back to Task</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: `/tasks/${taskId}` })}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Form Submission</h1>
          <p className="text-muted-foreground mt-2">{formDefinition.name}</p>
        </div>
      </div>

      <SubmissionValueViewer formDefinition={formDefinition} submissionData={submission.data} />
    </div>
  );
}

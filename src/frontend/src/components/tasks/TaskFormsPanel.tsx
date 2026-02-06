import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, CheckCircle2, Circle } from 'lucide-react';

type TaskFormsPanelProps = {
  forms: Array<{ 
    formId: string; 
    formName: string; 
    completed: boolean;
    submissionId?: string;
  }>;
  onOpenForm: (formId: string) => void;
  onViewSubmission: (formId: string) => void;
};

export default function TaskFormsPanel({ forms, onOpenForm, onViewSubmission }: TaskFormsPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Attached Forms</CardTitle>
      </CardHeader>
      <CardContent>
        {forms.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No forms attached to this task</div>
        ) : (
          <div className="space-y-3">
            {forms.map((form) => (
              <div key={form.formId} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {form.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div>
                    <div className="font-medium">{form.formName}</div>
                    <Badge variant={form.completed ? 'default' : 'outline'} className="mt-1">
                      {form.completed ? 'Submitted' : 'Not Started'}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  {form.completed && form.submissionId ? (
                    <Button variant="outline" size="sm" onClick={() => onViewSubmission(form.formId)}>
                      View Submission
                    </Button>
                  ) : (
                    <Button size="sm" onClick={() => onOpenForm(form.formId)}>
                      <FileText className="mr-2 h-4 w-4" />
                      Fill Form
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

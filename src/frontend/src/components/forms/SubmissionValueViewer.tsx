import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import type { FormDefinition } from '../../backend';

type SubmissionValueViewerProps = {
  formDefinition: FormDefinition;
  submissionData: Record<string, any>;
};

export default function SubmissionValueViewer({ formDefinition, submissionData }: SubmissionValueViewerProps) {
  const renderValue = (fieldId: string, value: any) => {
    if (value === null || value === undefined) return <span className="text-muted-foreground">Not provided</span>;

    if (typeof value === 'object' && value.fileName) {
      return (
        <div className="text-sm">
          <div className="font-medium">{value.fileName}</div>
          <div className="text-muted-foreground">{(value.fileSize / 1024).toFixed(2)} KB</div>
        </div>
      );
    }

    if (Array.isArray(value)) {
      return <span>{value.join(', ')}</span>;
    }

    return <span>{String(value)}</span>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{formDefinition.name} - Submission</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {formDefinition.fields.map((field) => (
            <div key={field.id} className="space-y-1">
              <Label className="text-muted-foreground">{field.fieldLabel}</Label>
              <div className="text-sm">{renderValue(field.id, submissionData[field.id])}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FileUploadField from './fields/FileUploadField';
import type { FormDefinition, FormField } from '../../backend';

type DynamicFormRendererProps = {
  formDefinition: FormDefinition;
  initialData?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void;
  isSubmitting?: boolean;
};

export default function DynamicFormRenderer({
  formDefinition,
  initialData = {},
  onSubmit,
  isSubmitting,
}: DynamicFormRendererProps) {
  const [formData, setFormData] = useState<Record<string, any>>(initialData);

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const renderField = (field: FormField) => {
    const fieldTypeValue = typeof field.fieldType === 'string' ? field.fieldType : Object.keys(field.fieldType)[0];
    const value = formData[field.id] || '';
    const required = field.validations?.required || false;

    switch (fieldTypeValue) {
      case 'singleLine':
        return (
          <Input
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            required={required}
          />
        );

      case 'multiLine':
        return (
          <Textarea
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            required={required}
            rows={4}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            required={required}
          />
        );

      case 'date':
        return (
          <Input
            type="date"
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            required={required}
          />
        );

      case 'dateTime':
        return (
          <Input
            type="datetime-local"
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            required={required}
          />
        );

      case 'dropdown':
        return (
          <Select value={value} onValueChange={(val) => handleFieldChange(field.id, val)} required={required}>
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {/* Options would be loaded from lookup */}
              <SelectItem value="option1">Option 1</SelectItem>
              <SelectItem value="option2">Option 2</SelectItem>
            </SelectContent>
          </Select>
        );

      case 'multiSelect':
        return (
          <div className="space-y-2">
            {/* Multi-select would render checkboxes for each option */}
            <div className="flex items-center space-x-2">
              <Checkbox id={`${field.id}-1`} />
              <Label htmlFor={`${field.id}-1`}>Option 1</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id={`${field.id}-2`} />
              <Label htmlFor={`${field.id}-2`}>Option 2</Label>
            </div>
          </div>
        );

      case 'fileUpload':
        return (
          <FileUploadField
            value={value}
            onChange={(val) => handleFieldChange(field.id, val)}
            required={required}
          />
        );

      default:
        return <Input value={value} onChange={(e) => handleFieldChange(field.id, e.target.value)} />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{formDefinition.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {formDefinition.fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label>
                {field.fieldLabel}
                {field.validations?.required && <span className="text-destructive ml-1">*</span>}
              </Label>
              {renderField(field)}
            </div>
          ))}
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

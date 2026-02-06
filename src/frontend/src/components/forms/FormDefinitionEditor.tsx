import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, GripVertical } from 'lucide-react';
import FieldDefinitionRow from './FieldDefinitionRow';
import type { FormField } from '../../backend';

type FormDefinitionEditorProps = {
  formName: string;
  fields: FormField[];
  onFormNameChange: (name: string) => void;
  onFieldsChange: (fields: FormField[]) => void;
};

export default function FormDefinitionEditor({
  formName,
  fields,
  onFormNameChange,
  onFieldsChange,
}: FormDefinitionEditorProps) {
  const handleAddField = () => {
    const newField: FormField = {
      id: crypto.randomUUID(),
      fieldLabel: 'New Field',
      fieldType: { __kind__: 'singleLine' } as any,
      validations: { required: false },
    };
    onFieldsChange([...fields, newField]);
  };

  const handleUpdateField = (index: number, field: FormField) => {
    const newFields = [...fields];
    newFields[index] = field;
    onFieldsChange(newFields);
  };

  const handleRemoveField = (index: number) => {
    onFieldsChange(fields.filter((_, i) => i !== index));
  };

  const handleMoveField = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === fields.length - 1)) return;
    const newFields = [...fields];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newFields[index], newFields[targetIndex]] = [newFields[targetIndex], newFields[index]];
    onFieldsChange(newFields);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Form Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="formName">Form Name</Label>
            <Input
              id="formName"
              value={formName}
              onChange={(e) => onFormNameChange(e.target.value)}
              placeholder="Enter form name"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Form Fields</CardTitle>
            <Button onClick={handleAddField} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Field
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {fields.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No fields added yet. Click "Add Field" to get started.</div>
          ) : (
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-2">
                  <div className="flex flex-col gap-1 pt-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 cursor-move"
                      onClick={() => handleMoveField(index, 'up')}
                      disabled={index === 0}
                    >
                      <GripVertical className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex-1">
                    <FieldDefinitionRow
                      field={field}
                      onUpdate={(updatedField) => handleUpdateField(index, updatedField)}
                      onRemove={() => handleRemoveField(index)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

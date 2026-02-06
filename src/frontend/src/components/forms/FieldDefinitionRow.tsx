import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import type { FormField, FieldType } from '../../backend';

type FieldDefinitionRowProps = {
  field: FormField;
  onUpdate: (field: FormField) => void;
  onRemove: () => void;
};

const fieldTypeOptions: Array<{ value: string; label: string }> = [
  { value: 'singleLine', label: 'Single Line Text' },
  { value: 'multiLine', label: 'Multi Line Text' },
  { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' },
  { value: 'dateTime', label: 'Date & Time' },
  { value: 'dropdown', label: 'Dropdown' },
  { value: 'multiSelect', label: 'Multi-Select' },
  { value: 'fileUpload', label: 'File Upload' },
];

export default function FieldDefinitionRow({ field, onUpdate, onRemove }: FieldDefinitionRowProps) {
  const fieldTypeValue = typeof field.fieldType === 'string' ? field.fieldType : Object.keys(field.fieldType)[0];

  const handleFieldTypeChange = (value: string) => {
    onUpdate({
      ...field,
      fieldType: { __kind__: value } as any,
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-1 space-y-2">
              <Label>Field Label</Label>
              <Input
                value={field.fieldLabel}
                onChange={(e) => onUpdate({ ...field, fieldLabel: e.target.value })}
                placeholder="Enter field label"
              />
            </div>
            <div className="flex-1 space-y-2">
              <Label>Field Type</Label>
              <Select value={fieldTypeValue} onValueChange={handleFieldTypeChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fieldTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="ghost" size="icon" onClick={onRemove} className="mt-8">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id={`required-${field.id}`}
              checked={field.validations?.required || false}
              onCheckedChange={(checked) =>
                onUpdate({
                  ...field,
                  validations: { ...field.validations, required: checked as boolean },
                })
              }
            />
            <Label htmlFor={`required-${field.id}`} className="text-sm font-normal">
              Required field
            </Label>
          </div>

          {(fieldTypeValue === 'dropdown' || fieldTypeValue === 'multiSelect') && (
            <div className="space-y-2">
              <Label>Lookup Source</Label>
              <Input
                value={field.masterListRef || ''}
                onChange={(e) => onUpdate({ ...field, masterListRef: e.target.value })}
                placeholder="Enter master list ID or type (e.g., 'departments', 'categories')"
              />
              <p className="text-xs text-muted-foreground">
                Reference a master list ID or fixed master type (departments, categories, statuses, priorities, taskTypes)
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

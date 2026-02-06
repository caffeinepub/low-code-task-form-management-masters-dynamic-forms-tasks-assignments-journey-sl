import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import { FieldType } from '../../backend';
import { fieldTypeToString } from '../../utils/formDefinitionEncoding';
import type { FormField } from '../../backend';

type FieldDefinitionRowProps = {
  field: FormField;
  onUpdate: (field: FormField) => void;
  onRemove: () => void;
};

const fieldTypeOptions: Array<{ value: FieldType; label: string }> = [
  { value: FieldType.singleLine, label: 'Single Line Text' },
  { value: FieldType.multiLine, label: 'Multi Line Text' },
  { value: FieldType.number_, label: 'Number' },
  { value: FieldType.date, label: 'Date' },
  { value: FieldType.dateTime, label: 'Date & Time' },
  { value: FieldType.dropdown, label: 'Dropdown' },
  { value: FieldType.multiSelect, label: 'Multi-Select' },
  { value: FieldType.fileUpload, label: 'File Upload' },
];

export default function FieldDefinitionRow({ field, onUpdate, onRemove }: FieldDefinitionRowProps) {
  const fieldTypeValue = fieldTypeToString(field.fieldType);

  const handleFieldTypeChange = (value: string) => {
    // Map the display value back to the enum
    const enumValue = value === 'number' ? FieldType.number_ : value as FieldType;
    onUpdate({
      ...field,
      fieldType: enumValue,
    });
  };

  const handleRequiredChange = (checked: boolean) => {
    onUpdate({
      ...field,
      validations: checked ? { required: true } : undefined,
    });
  };

  const handleMasterListRefChange = (value: string) => {
    onUpdate({
      ...field,
      masterListRef: value.trim() || undefined,
    });
  };

  const showLookupSource = fieldTypeValue === 'dropdown' || fieldTypeValue === 'multiSelect';

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
                    <SelectItem key={option.value} value={fieldTypeToString(option.value)}>
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
              onCheckedChange={handleRequiredChange}
            />
            <Label htmlFor={`required-${field.id}`} className="text-sm font-normal">
              Required field
            </Label>
          </div>

          {showLookupSource && (
            <div className="space-y-2">
              <Label>Lookup Source</Label>
              <Input
                value={field.masterListRef || ''}
                onChange={(e) => handleMasterListRefChange(e.target.value)}
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

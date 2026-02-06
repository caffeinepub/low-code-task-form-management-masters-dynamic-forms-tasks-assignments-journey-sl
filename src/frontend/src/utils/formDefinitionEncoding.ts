import type { FormDefinition, FormField, ValidationRules } from '../backend';
import { FieldType as FieldTypeEnum } from '../backend';

/**
 * Normalizes a FormDefinition for backend submission by ensuring all fields
 * match the expected Candid types (enums, optionals, etc.)
 */
export function normalizeFormDefinition(draft: FormDefinition): FormDefinition {
  return {
    ...draft,
    fields: draft.fields.map(normalizeFormField),
  };
}

/**
 * Normalizes a FormField for backend submission
 */
export function normalizeFormField(field: FormField): FormField {
  // Normalize fieldType to enum string
  const fieldType = normalizeFieldType(field.fieldType);
  
  // Normalize validations
  const validations = normalizeValidations(field.validations);
  
  // Normalize options (only include if not empty)
  const options = field.options && field.options.length > 0 ? field.options : undefined;
  
  // Normalize masterListRef (only include if not empty)
  const masterListRef = field.masterListRef && field.masterListRef.trim() !== '' 
    ? field.masterListRef.trim() 
    : undefined;
  
  return {
    id: field.id,
    fieldLabel: field.fieldLabel,
    fieldType,
    validations,
    options,
    masterListRef,
  };
}

/**
 * Normalizes FieldType to the correct enum value
 */
function normalizeFieldType(fieldType: any): FieldTypeEnum {
  // If it's already a valid enum value, return it
  if (typeof fieldType === 'string') {
    // Map 'number' to 'number_' for the backend enum
    if (fieldType === 'number') {
      return FieldTypeEnum.number_;
    }
    // Return as-is if it's a valid enum value
    return fieldType as FieldTypeEnum;
  }
  
  // If it's an object with __kind__ (shouldn't happen with proper typing, but handle it)
  if (fieldType && typeof fieldType === 'object' && '__kind__' in fieldType) {
    const kind = (fieldType as any).__kind__;
    // Map 'number' to 'number_' for the backend enum
    if (kind === 'number') {
      return FieldTypeEnum.number_;
    }
    return kind as FieldTypeEnum;
  }
  
  // Default fallback
  return FieldTypeEnum.singleLine;
}

/**
 * Normalizes ValidationRules to ensure all required fields are present
 */
function normalizeValidations(validations: Partial<ValidationRules> | undefined): ValidationRules | undefined {
  if (!validations) {
    return undefined;
  }
  
  // Only return validations if at least one constraint is set
  const hasConstraints = 
    validations.required === true ||
    validations.minLength !== undefined ||
    validations.maxLength !== undefined ||
    validations.minValue !== undefined ||
    validations.maxValue !== undefined;
  
  if (!hasConstraints) {
    return undefined;
  }
  
  return {
    required: validations.required || false,
    minLength: validations.minLength,
    maxLength: validations.maxLength,
    minValue: validations.minValue,
    maxValue: validations.maxValue,
  };
}

/**
 * Converts a backend FieldType enum to a display-friendly string
 */
export function fieldTypeToString(fieldType: any): string {
  if (typeof fieldType === 'string') {
    // Handle the 'number_' enum case
    if (fieldType === FieldTypeEnum.number_) {
      return 'number';
    }
    return fieldType;
  }
  
  // Handle object with __kind__ (shouldn't happen with proper typing, but handle it)
  if (fieldType && typeof fieldType === 'object' && '__kind__' in fieldType) {
    const kind = (fieldType as any).__kind__;
    if (kind === 'number_') {
      return 'number';
    }
    return kind;
  }
  
  return 'singleLine';
}

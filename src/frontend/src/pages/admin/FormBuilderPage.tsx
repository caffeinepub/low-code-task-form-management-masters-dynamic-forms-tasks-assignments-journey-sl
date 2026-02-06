import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Principal } from '@dfinity/principal';
import RequireAdmin from '../../components/auth/RequireAdmin';
import FormDefinitionEditor from '../../components/forms/FormDefinitionEditor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { 
  useGetFormDefinitions, 
  useCreateFormDefinition, 
  useUpdateFormDefinition,
  useDeleteFormDefinition 
} from '../../hooks/forms/useFormDefinitions';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { toast } from 'sonner';
import { getErrorMessage } from '../../utils/getErrorMessage';
import { normalizeFormDefinition } from '../../utils/formDefinitionEncoding';
import type { FormField, FormDefinition } from '../../backend';

export default function FormBuilderPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: formDefinitions = [], isLoading } = useGetFormDefinitions();
  const createFormDefinition = useCreateFormDefinition();
  const updateFormDefinition = useUpdateFormDefinition();
  const deleteFormDefinition = useDeleteFormDefinition();

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [fields, setFields] = useState<FormField[]>([]);

  const handleCreateNew = () => {
    setFormName('');
    setFields([]);
    setEditingId(null);
    setIsEditing(true);
  };

  const handleEdit = (form: FormDefinition) => {
    setFormName(form.name);
    setFields(form.fields);
    setEditingId(form.id);
    setIsEditing(true);
  };

  const handleSave = async () => {
    // Validate form name
    if (!formName.trim()) {
      toast.error('Form name is required');
      return;
    }

    // Validate at least one field
    if (fields.length === 0) {
      toast.error('At least one field is required');
      return;
    }

    try {
      const now = BigInt(Date.now() * 1000000);
      
      // Use authenticated principal if available, otherwise anonymous principal
      const creatorPrincipal = identity 
        ? identity.getPrincipal() 
        : Principal.anonymous();
      
      const formDefinition: FormDefinition = {
        id: editingId || crypto.randomUUID(),
        name: formName.trim(),
        version: BigInt(1),
        fields,
        created: now,
        lastUpdated: now,
        creator: creatorPrincipal,
      };

      // Normalize the form definition to match backend types
      const normalizedForm = normalizeFormDefinition(formDefinition);

      if (editingId) {
        // Update existing form
        await updateFormDefinition.mutateAsync({
          id: editingId,
          formDefinition: normalizedForm,
        });
        toast.success('Form definition updated successfully');
      } else {
        // Create new form
        await createFormDefinition.mutateAsync(normalizedForm);
        toast.success('Form definition created successfully');
      }
      
      setIsEditing(false);
      setEditingId(null);
      setFormName('');
      setFields([]);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(`Failed to save form definition: ${errorMessage}`);
      console.error('Form save error:', error);
      // Keep the editor open with current state on error
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormName('');
    setFields([]);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this form definition?')) return;

    try {
      await deleteFormDefinition.mutateAsync(id);
      toast.success('Form definition deleted successfully');
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(`Failed to delete form definition: ${errorMessage}`);
      console.error('Form deletion error:', error);
    }
  };

  const isSaving = createFormDefinition.isPending || updateFormDefinition.isPending;

  return (
    <RequireAdmin>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Form Builder</h1>
            <p className="text-muted-foreground mt-2">Create and manage dynamic form definitions</p>
          </div>
          {!isEditing && (
            <Button onClick={handleCreateNew}>
              <Plus className="mr-2 h-4 w-4" />
              Create Form
            </Button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <FormDefinitionEditor
              formName={formName}
              fields={fields}
              onFormNameChange={setFormName}
              onFieldsChange={setFields}
            />
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : editingId ? 'Update Form' : 'Save Form'}
              </Button>
              <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Form Definitions</CardTitle>
              <CardDescription>Manage your reusable form definitions</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : formDefinitions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No form definitions found. Create one to get started.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Version</TableHead>
                      <TableHead>Fields</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formDefinitions.map((form) => (
                      <TableRow key={form.id}>
                        <TableCell className="font-medium">{form.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">v{form.version.toString()}</Badge>
                        </TableCell>
                        <TableCell>{form.fields.length} fields</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleEdit(form)}
                              disabled={deleteFormDefinition.isPending}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDelete(form.id)}
                              disabled={deleteFormDefinition.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </RequireAdmin>
  );
}

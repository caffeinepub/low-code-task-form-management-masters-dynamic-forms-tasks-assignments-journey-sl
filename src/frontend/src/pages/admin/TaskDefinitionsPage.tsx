import { useState } from 'react';
import RequireAdmin from '../../components/auth/RequireAdmin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useGetFormDefinitions } from '../../hooks/forms/useFormDefinitions';
import { toast } from 'sonner';

// Placeholder for task definitions - backend doesn't have this yet
type TaskDefinition = {
  id: string;
  name: string;
  description: string;
  attachedForms: string[];
  created: bigint;
};

export default function TaskDefinitionsPage() {
  const [taskDefinitions] = useState<TaskDefinition[]>([]);
  const { data: formDefinitions = [] } = useGetFormDefinitions();

  const handleCreate = () => {
    toast.info('Task Definition creation is not yet available. Backend support needed.');
  };

  const handleEdit = (id: string) => {
    toast.info('Task Definition editing is not yet available. Backend support needed.');
  };

  const handleDelete = (id: string) => {
    toast.info('Task Definition deletion is not yet available. Backend support needed.');
  };

  return (
    <RequireAdmin>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Task Definitions</h1>
            <p className="text-muted-foreground mt-2">Define reusable task templates with attached forms</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Create Task Definition
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Task Definitions</CardTitle>
            <CardDescription>
              Manage your task definition templates. Each definition can have multiple forms attached.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {taskDefinitions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p className="mb-4">No task definitions created yet.</p>
                <p className="text-sm">
                  Note: Backend support for Task Definitions is required. Currently using the existing Task model.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Attached Forms</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {taskDefinitions.map((def) => (
                    <TableRow key={def.id}>
                      <TableCell className="font-medium">{def.name}</TableCell>
                      <TableCell>{def.description}</TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {def.attachedForms.map((formId) => (
                            <Badge key={formId} variant="outline">
                              {formDefinitions.find((f) => f.id === formId)?.name || formId}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{new Date(Number(def.created) / 1000000).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(def.id)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(def.id)}>
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
      </div>
    </RequireAdmin>
  );
}

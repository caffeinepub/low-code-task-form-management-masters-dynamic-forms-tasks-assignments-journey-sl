import RequireAdmin from '../../components/auth/RequireAdmin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function TaskDefinitionsPage() {
  return (
    <RequireAdmin>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Task Definitions</h1>
            <p className="text-muted-foreground mt-2">Define reusable task templates with attached forms and SLA rules</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Task Definition
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Task Definitions</CardTitle>
            <CardDescription>Manage your task definition templates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              Task definitions management coming soon. This will allow you to create reusable task templates with attached forms and SLA configurations.
            </div>
          </CardContent>
        </Card>
      </div>
    </RequireAdmin>
  );
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export default function CreateTaskPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/tasks' })}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create Task</h1>
          <p className="text-muted-foreground mt-2">Create a new task from a task definition</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Task Creation</CardTitle>
          <CardDescription>Select a task definition and provide task details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            Task creation form coming soon. This will allow you to create tasks from task definitions.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

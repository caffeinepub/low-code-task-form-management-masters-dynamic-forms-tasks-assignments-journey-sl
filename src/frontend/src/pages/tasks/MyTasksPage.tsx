import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import TaskListTable from '../../components/tasks/TaskListTable';
import { useGetMyTasks } from '../../hooks/tasks/useTaskDefinitionsAndTasks';

export default function MyTasksPage() {
  const { data: tasks = [], isLoading } = useGetMyTasks();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Tasks</h1>
        <p className="text-muted-foreground mt-2">Tasks assigned to you</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Tasks</CardTitle>
          <CardDescription>View and manage your assigned tasks</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">Loading tasks...</div>
          ) : (
            <TaskListTable tasks={tasks} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

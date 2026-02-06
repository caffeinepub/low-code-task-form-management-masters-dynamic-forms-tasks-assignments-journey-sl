import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import TaskListTable from '../../components/tasks/TaskListTable';
import { useGetDepartmentPoolTasks } from '../../hooks/tasks/useTaskDefinitionsAndTasks';

export default function DepartmentPoolPage() {
  const { data: tasks = [], isLoading } = useGetDepartmentPoolTasks();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Department Pool</h1>
        <p className="text-muted-foreground mt-2">Tasks available for your department to pick up</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Tasks</CardTitle>
          <CardDescription>Pick up tasks assigned to your department</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">Loading tasks...</div>
          ) : (
            <TaskListTable tasks={tasks} showAssignment />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

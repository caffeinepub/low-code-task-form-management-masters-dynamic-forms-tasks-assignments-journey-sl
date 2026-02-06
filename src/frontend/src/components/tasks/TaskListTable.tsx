import { useNavigate } from '@tanstack/react-router';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';
import type { Task } from '../../hooks/tasks/useTaskDefinitionsAndTasks';

type TaskListTableProps = {
  tasks: Task[];
  showAssignment?: boolean;
};

export default function TaskListTable({ tasks, showAssignment = false }: TaskListTableProps) {
  const navigate = useNavigate();

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString();
  };

  const getCompletionPercentage = (task: Task) => {
    if (task.attachedForms.length === 0) return 0;
    const completed = task.attachedForms.filter((f) => f.completed).length;
    return Math.round((completed / task.attachedForms.length) * 100);
  };

  const getAssignmentDisplay = (task: Task) => {
    if (!task.assignment) return null;
    
    if (task.assignment.__kind__ === 'department') {
      return { icon: '🏢 ', value: task.assignment.department };
    } else {
      return { icon: '👤 ', value: task.assignment.user.toString() };
    }
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Task Type</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            {showAssignment && <TableHead>Assignment</TableHead>}
            <TableHead>Created</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Forms</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={showAssignment ? 8 : 7} className="text-center py-8 text-muted-foreground">
                No tasks found
              </TableCell>
            </TableRow>
          ) : (
            tasks.map((task) => {
              const assignmentDisplay = getAssignmentDisplay(task);
              return (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.taskType}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{task.priority}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge>{task.status}</Badge>
                  </TableCell>
                  {showAssignment && (
                    <TableCell>
                      {assignmentDisplay ? (
                        <span className="text-sm">
                          {assignmentDisplay.icon}
                          {assignmentDisplay.value}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-sm">Unassigned</span>
                      )}
                    </TableCell>
                  )}
                  <TableCell>{formatDate(task.createdDate)}</TableCell>
                  <TableCell>{formatDate(task.dueDate)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {getCompletionPercentage(task)}% ({task.attachedForms.filter((f) => f.completed).length}/
                      {task.attachedForms.length})
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate({ to: `/tasks/${task.id}` })}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}

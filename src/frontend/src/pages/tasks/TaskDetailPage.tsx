import { useParams, useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import TaskFormsPanel from '../../components/tasks/TaskFormsPanel';
import TaskJourneyTimeline from '../../components/tasks/TaskJourneyTimeline';
import PickupTaskButton from '../../components/tasks/PickupTaskButton';
import ReassignTaskDialog from '../../components/tasks/ReassignTaskDialog';
import SlaStatusBadge from '../../components/tasks/SlaStatusBadge';
import { useGetTask } from '../../hooks/tasks/useTaskDefinitionsAndTasks';
import { useGetTaskJourney } from '../../hooks/tasks/useTaskJourney';

export default function TaskDetailPage() {
  const { taskId } = useParams({ from: '/tasks/$taskId' });
  const navigate = useNavigate();
  const { data: task, isLoading } = useGetTask(taskId);
  const { data: journeyEvents = [] } = useGetTaskJourney(taskId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-muted-foreground">Loading task...</div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-muted-foreground mb-4">Task not found</div>
          <Button onClick={() => navigate({ to: '/tasks' })}>Go to My Tasks</Button>
        </div>
      </div>
    );
  }

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/tasks' })}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{task.taskType}</h1>
          <p className="text-muted-foreground mt-2">Task ID: {task.id}</p>
        </div>
        <div className="flex gap-2">
          {task.assignment?.type === 'department' && <PickupTaskButton taskId={task.id} />}
          <ReassignTaskDialog taskId={task.id} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Task Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Priority</div>
                <Badge variant="outline" className="mt-1">
                  {task.priority}
                </Badge>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Status</div>
                <Badge className="mt-1">{task.status}</Badge>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Created</div>
                <div className="mt-1">{formatDate(task.createdDate)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Due Date</div>
                <div className="mt-1">{formatDate(task.dueDate)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">SLA Status</div>
                <div className="mt-1">
                  <SlaStatusBadge status={task.slaStatus} />
                </div>
              </div>
              {task.completionDate && (
                <div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                  <div className="mt-1">{formatDate(task.completionDate)}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assignment</CardTitle>
          </CardHeader>
          <CardContent>
            {task.assignment ? (
              <div className="space-y-2">
                <div>
                  <div className="text-sm text-muted-foreground">Type</div>
                  <div className="mt-1 capitalize">{task.assignment.type}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Assigned To</div>
                  <div className="mt-1">{task.assignment.value}</div>
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground">Not assigned</div>
            )}
          </CardContent>
        </Card>
      </div>

      <TaskFormsPanel
        forms={task.formCompletionStatus.map((f) => ({
          formId: f.formId,
          formName: `Form ${f.formId}`,
          completed: f.completed,
        }))}
        onOpenForm={(formId) => console.log('Open form', formId)}
        onViewSubmission={(formId) => console.log('View submission', formId)}
      />

      <TaskJourneyTimeline events={journeyEvents} />
    </div>
  );
}

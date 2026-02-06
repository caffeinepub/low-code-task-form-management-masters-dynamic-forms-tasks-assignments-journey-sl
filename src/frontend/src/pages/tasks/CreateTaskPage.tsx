import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useCreateTask } from '../../hooks/tasks/useTaskDefinitionsAndTasks';
import { useGetFormDefinitions } from '../../hooks/forms/useFormDefinitions';
import { useGetTaskTypes, useGetPriorities, useGetStatuses } from '../../hooks/masterData/useMasterData';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { toast } from 'sonner';
import { getErrorMessage } from '../../utils/getErrorMessage';
import type { Task, TaskFormAttachment } from '../../backend';

export default function CreateTaskPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const createTask = useCreateTask();
  const { data: formDefinitions = [] } = useGetFormDefinitions();
  const { data: taskTypes = [] } = useGetTaskTypes();
  const { data: priorities = [] } = useGetPriorities();
  const { data: statuses = [] } = useGetStatuses();

  const [selectedForms, setSelectedForms] = useState<string[]>([]);
  const [taskType, setTaskType] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleFormToggle = (formId: string) => {
    setSelectedForms((prev) =>
      prev.includes(formId) ? prev.filter((id) => id !== formId) : [...prev, formId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedForms.length === 0) {
      toast.error('Please select at least one form for this task');
      return;
    }

    if (!identity) {
      toast.error('You must be logged in to create a task');
      return;
    }

    if (!taskType || !priority || !status || !dueDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const taskId = `task-${Date.now()}`;
      const attachedForms: TaskFormAttachment[] = selectedForms.map((formId) => ({
        formDefinitionId: formId,
        completed: false,
      }));

      const task: Task = {
        id: taskId,
        taskType,
        priority,
        status,
        owner: identity.getPrincipal(),
        assignment: undefined,
        createdDate: BigInt(Date.now() * 1000000),
        dueDate: BigInt(new Date(dueDate).getTime() * 1000000),
        completionDate: undefined,
        attachedForms,
      };

      await createTask.mutateAsync(task);
      toast.success('Task created successfully');
      navigate({ to: `/tasks/${taskId}` });
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/tasks' })}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create Task</h1>
          <p className="text-muted-foreground mt-2">Create a new task with attached forms</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Task Details</CardTitle>
            <CardDescription>Provide task information and select forms to attach</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="taskType">
                  Task Type <span className="text-destructive">*</span>
                </Label>
                <Select value={taskType} onValueChange={setTaskType} required>
                  <SelectTrigger id="taskType">
                    <SelectValue placeholder="Select task type" />
                  </SelectTrigger>
                  <SelectContent>
                    {taskTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">
                  Priority <span className="text-destructive">*</span>
                </Label>
                <Select value={priority} onValueChange={setPriority} required>
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">
                  Status <span className="text-destructive">*</span>
                </Label>
                <Select value={status} onValueChange={setStatus} required>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">
                  Due Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>
                Attached Forms <span className="text-destructive">*</span>
              </Label>
              <p className="text-sm text-muted-foreground mb-3">
                Select at least one form to attach to this task
              </p>
              {formDefinitions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground border rounded-lg">
                  No form definitions available. Please create forms first.
                </div>
              ) : (
                <div className="border rounded-lg divide-y">
                  {formDefinitions.map((form) => (
                    <label
                      key={form.id}
                      className="flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedForms.includes(form.id)}
                        onChange={() => handleFormToggle(form.id)}
                        className="h-4 w-4"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{form.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {form.fields.length} field{form.fields.length !== 1 ? 's' : ''} · Version {form.version.toString()}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
              {selectedForms.length > 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  {selectedForms.length} form{selectedForms.length !== 1 ? 's' : ''} selected
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={createTask.isPending || selectedForms.length === 0}>
                {createTask.isPending ? 'Creating...' : 'Create Task'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate({ to: '/tasks' })}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

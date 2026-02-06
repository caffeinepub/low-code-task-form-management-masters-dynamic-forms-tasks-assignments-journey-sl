import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useReassignTask } from '../../hooks/tasks/useAssignmentActions';
import { toast } from 'sonner';
import { UserCog } from 'lucide-react';

type ReassignTaskDialogProps = {
  taskId: string;
};

export default function ReassignTaskDialog({ taskId }: ReassignTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [assignmentType, setAssignmentType] = useState<'department' | 'user'>('user');
  const [assignmentValue, setAssignmentValue] = useState('');
  const reassignTask = useReassignTask();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignmentValue.trim()) {
      toast.error('Please provide an assignment value');
      return;
    }

    try {
      await reassignTask.mutateAsync({
        taskId,
        assignmentType,
        assignmentValue: assignmentValue.trim(),
      });
      toast.success('Task reassigned successfully');
      setOpen(false);
      setAssignmentValue('');
    } catch (error) {
      toast.error('Failed to reassign task');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <UserCog className="mr-2 h-4 w-4" />
          Reassign
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reassign Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Assignment Type</Label>
              <Select value={assignmentType} onValueChange={(val) => setAssignmentType(val as 'department' | 'user')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="department">Department</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{assignmentType === 'user' ? 'User Principal' : 'Department Name'}</Label>
              <Input
                value={assignmentValue}
                onChange={(e) => setAssignmentValue(e.target.value)}
                placeholder={assignmentType === 'user' ? 'Enter user principal' : 'Enter department name'}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={reassignTask.isPending}>
              {reassignTask.isPending ? 'Reassigning...' : 'Reassign'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

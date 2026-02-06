import { Button } from '@/components/ui/button';
import { usePickupTask } from '../../hooks/tasks/useAssignmentActions';
import { toast } from 'sonner';
import { UserPlus } from 'lucide-react';

type PickupTaskButtonProps = {
  taskId: string;
};

export default function PickupTaskButton({ taskId }: PickupTaskButtonProps) {
  const pickupTask = usePickupTask();

  const handlePickup = async () => {
    try {
      await pickupTask.mutateAsync(taskId);
      toast.success('Task picked up successfully');
    } catch (error) {
      toast.error('Failed to pick up task');
      console.error(error);
    }
  };

  return (
    <Button onClick={handlePickup} disabled={pickupTask.isPending}>
      <UserPlus className="mr-2 h-4 w-4" />
      {pickupTask.isPending ? 'Picking up...' : 'Pick Up Task'}
    </Button>
  );
}

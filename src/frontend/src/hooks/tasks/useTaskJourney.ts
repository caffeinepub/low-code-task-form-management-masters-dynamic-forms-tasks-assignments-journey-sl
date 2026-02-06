import { useQuery } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { TaskAuditEntry } from '../../backend';
import { getErrorMessage } from '../../utils/getErrorMessage';

export type JourneyEvent = {
  timestamp: bigint;
  user: string;
  action: string;
  details: string;
};

export function useGetTaskJourney(taskId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<JourneyEvent[]>({
    queryKey: ['taskJourney', taskId],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const auditLog: TaskAuditEntry[] = await actor.getTaskAuditLog(taskId);
        return auditLog.map((entry) => ({
          timestamp: entry.timestamp,
          user: entry.user.toString(),
          action: Object.keys(entry.action)[0] || 'unknown',
          details: entry.details,
        }));
      } catch (error) {
        console.error('Failed to fetch task journey:', error);
        // Return empty array instead of throwing to avoid breaking the UI
        return [];
      }
    },
    enabled: !!actor && !isFetching && !!taskId,
  });
}

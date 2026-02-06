import { useQuery } from '@tanstack/react-query';
import { useActor } from '../useActor';

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
      // Backend needs: getTaskJourney(taskId) query method
      return [];
    },
    enabled: !!actor && !isFetching && !!taskId,
  });
}

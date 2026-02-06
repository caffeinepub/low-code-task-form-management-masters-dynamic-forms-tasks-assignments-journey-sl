import { useQuery } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { MasterListItem } from '../../backend';

export type LookupOption = {
  value: string;
  label: string;
};

export function useLookupOptions(masterType: string, masterListId?: string) {
  const { actor, isFetching } = useActor();

  return useQuery<LookupOption[]>({
    queryKey: ['lookupOptions', masterType, masterListId],
    queryFn: async () => {
      if (!actor) return [];
      // Backend needs query methods to get master items by type or list ID
      // For now, return empty array
      return [];
    },
    enabled: !!actor && !isFetching && !!masterType,
  });
}

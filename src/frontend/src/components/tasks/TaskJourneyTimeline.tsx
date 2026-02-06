import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import type { JourneyEvent } from '../../hooks/tasks/useTaskJourney';

type TaskJourneyTimelineProps = {
  events: JourneyEvent[];
};

export default function TaskJourneyTimeline({ events }: TaskJourneyTimelineProps) {
  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Journey</CardTitle>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No journey events yet</div>
        ) : (
          <div className="space-y-4">
            {events.map((event, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  {index < events.length - 1 && <div className="w-px flex-1 bg-border mt-2" />}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{event.action}</div>
                    <div className="text-xs text-muted-foreground">{formatTimestamp(event.timestamp)}</div>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">{event.details}</div>
                  <div className="text-xs text-muted-foreground mt-1">By: {event.user}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

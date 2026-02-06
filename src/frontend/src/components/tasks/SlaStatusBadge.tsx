import { Badge } from '@/components/ui/badge';
import { Clock, AlertTriangle, XCircle } from 'lucide-react';

type SlaStatusBadgeProps = {
  status?: 'onTrack' | 'atRisk' | 'breached';
};

export default function SlaStatusBadge({ status }: SlaStatusBadgeProps) {
  if (!status) {
    return <Badge variant="outline">No SLA</Badge>;
  }

  switch (status) {
    case 'onTrack':
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <Clock className="mr-1 h-3 w-3" />
          On Track
        </Badge>
      );
    case 'atRisk':
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <AlertTriangle className="mr-1 h-3 w-3" />
          At Risk
        </Badge>
      );
    case 'breached':
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <XCircle className="mr-1 h-3 w-3" />
          Breached
        </Badge>
      );
  }
}

import { Badge } from '@/Components/ui/badge';
import { TASK_STATUSES, TaskStatus } from '@/types/task';

interface TaskStatusBadgeProps {
  status: TaskStatus;
}

const variantMap: Record<
  TaskStatus,
  { variant: 'default' | 'secondary' | 'outline'; className?: string }
> = {
  pending: { variant: 'secondary' },
  in_progress: { variant: 'default' },
  complete: {
    variant: 'outline',
    className: 'border-green-300 text-green-700',
  },
};

export default function TaskStatusBadge({ status }: TaskStatusBadgeProps) {
  const label = TASK_STATUSES.find((s) => s.value === status)?.label ?? status;
  const { variant, className } = variantMap[status];

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
}

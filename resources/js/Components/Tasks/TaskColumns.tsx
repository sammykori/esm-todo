import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { PencilIcon, TrashIcon } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/Components/ui/alert-dialog';
import { Button } from '@/Components/ui/button';
import { Task, TASK_PRIORITIES } from '@/types/task';
import TaskStatusBadge from './TaskStatusBadge';

export function formatDate(value: string | null): string {
  if (!value) return '—';
  const [year, month, day] = value.split('-');
  return `${day}/${month}/${year}`;
}

export function priorityLabel(value: Task['priority']): string {
  return TASK_PRIORITIES.find((p) => p.value === value)?.label ?? value;
}

export function buildColumns(onEdit: (task: Task) => void): ColumnDef<Task>[] {
  return [
    {
      accessorKey: 'title',
      header: 'Title',
      enableSorting: true,
      cell: ({ row }) => (
        <button
          type="button"
          className="text-left font-medium hover:underline"
          onClick={() => onEdit(row.original)}
        >
          {row.original.title}
        </button>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      enableSorting: false,
      cell: ({ row }) => <TaskStatusBadge status={row.original.status} />,
    },
    {
      accessorKey: 'priority',
      header: 'Priority',
      enableSorting: true,
      cell: ({ row }) => priorityLabel(row.original.priority),
    },
    {
      accessorKey: 'due_date',
      header: 'Due date',
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {formatDate(row.original.due_date)}
        </span>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Edit task"
            onClick={() => onEdit(row.original)}
          >
            <PencilIcon />
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Delete task"
                className="text-destructive hover:text-destructive"
              >
                <TrashIcon />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete task?</AlertDialogTitle>
                <AlertDialogDescription>
                  &ldquo;{row.original.title}&rdquo; will be permanently
                  deleted. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() =>
                    router.delete(route('tasks.destroy', row.original.id), {
                      preserveScroll: true,
                    })
                  }
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ];
}

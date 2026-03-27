import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  flexRender,
} from '@tanstack/react-table';

import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Task, TASK_PRIORITIES } from '@/types/task';
import TaskStatusBadge from './TaskStatusBadge';

function formatDate(value: string | null): string {
  if (!value) return '—';
  const [year, month, day] = value.split('-');
  return `${day}/${month}/${year}`;
}

function priorityLabel(value: Task['priority']): string {
  return TASK_PRIORITIES.find((p) => p.value === value)?.label ?? value;
}

function handleDelete(task: Task) {
  if (!window.confirm(`Delete "${task.title}"? This cannot be undone.`)) return;
  router.delete(route('tasks.destroy', task.id), { preserveScroll: true });
}

const columns: ColumnDef<Task>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    enableSorting: true,
    cell: ({ row }) => (
      <button
        type="button"
        className="text-left font-medium hover:underline"
        onClick={() => router.visit(route('tasks.edit', row.original.id))}
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
      <div className="flex items-center justify-end gap-2">
        <Button asChild variant="outline" size="sm">
          <Link href={route('tasks.edit', row.original.id)}>Edit</Link>
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => handleDelete(row.original)}
        >
          Delete
        </Button>
      </div>
    ),
  },
];

interface TaskTableProps {
  tasks: Task[];
}

export default function TaskTable({ tasks }: TaskTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data: tasks,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: 'includesString',
  });

  return (
    <div className="flex flex-col gap-4">
      <Input
        placeholder="Search tasks…"
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="max-w-sm"
      />

      {tasks.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-muted-foreground">
          <p className="text-sm">No tasks yet</p>
          <Button asChild variant="outline" size="sm">
            <Link href={route('tasks.create')}>Create your first task</Link>
          </Button>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/40">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-4 py-3 text-left font-medium text-muted-foreground"
                      >
                        {header.isPlaceholder ? null : header.column.getCanSort() ? (
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 hover:text-foreground"
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            <span className="text-xs">
                              {header.column.getIsSorted() === 'asc'
                                ? '↑'
                                : header.column.getIsSorted() === 'desc'
                                  ? '↓'
                                  : '↕'}
                            </span>
                          </button>
                        ) : (
                          flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b last:border-0 hover:bg-muted/30"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {table.getRowModel().rows.length === 0 && (
              <p className="py-10 text-center text-sm text-muted-foreground">
                No tasks match your search.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

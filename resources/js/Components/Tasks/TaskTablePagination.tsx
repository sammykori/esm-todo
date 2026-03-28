import { Table } from '@tanstack/react-table';
import { Button } from '@/Components/ui/button';
import { Task } from '@/types/task';

interface TaskTablePaginationProps {
  table: Table<Task>;
}

export default function TaskTablePagination({
  table,
}: TaskTablePaginationProps) {
  if (table.getPageCount() <= 1) return null;

  const { pageIndex } = table.getState().pagination;
  const total = table.getFilteredRowModel().rows.length;

  return (
    <div className="flex items-center justify-between border-t px-4 py-3">
      <p className="text-xs text-muted-foreground">
        Page {pageIndex + 1} of {table.getPageCount()}
        {' · '}
        {total} task{total !== 1 ? 's' : ''}
      </p>
      <div className="flex gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

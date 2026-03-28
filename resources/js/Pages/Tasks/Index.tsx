import { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { PlusIcon } from 'lucide-react';

import TaskSheet from '@/Components/Tasks/TaskSheet';
import TaskTable from '@/Components/Tasks/TaskTable';
import { Button } from '@/Components/ui/button';
import AppLayout from '@/Layouts/AppLayout';
import { PageProps, Task } from '@/types/task';

export default function Index() {
  const { tasks = [] } = usePage<PageProps>().props;

  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  function openSheet(task: Task | null) {
    setSelectedTask(task);
    setSheetOpen(true);
  }

  function handleSheetSuccess() {
    setSheetOpen(false);
    setSelectedTask(null);
  }

  return (
    <AppLayout
      actions={
        <Button size="sm" onClick={() => openSheet(null)}>
          <PlusIcon className="mr-1" />
          New Task
        </Button>
      }
    >
      <Head title="Tasks" />

      <TaskTable
        tasks={tasks}
        onEdit={openSheet}
        onCreateNew={() => openSheet(null)}
      />

      <TaskSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        task={selectedTask}
        onSuccess={handleSheetSuccess}
      />
    </AppLayout>
  );
}

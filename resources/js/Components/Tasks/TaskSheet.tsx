import { useState } from 'react';
import { router } from '@inertiajs/react';
import { TrashIcon } from 'lucide-react';

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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/Components/ui/sheet';
import { TaskFormValues } from '@/schemas/task';
import { Task } from '@/types/task';
import TaskStatusBadge from './TaskStatusBadge';
import TaskForm from './TaskForm';

interface TaskSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  onSuccess: () => void;
}

export default function TaskSheet({
  open,
  onOpenChange,
  task,
  onSuccess,
}: TaskSheetProps) {
  const [processing, setProcessing] = useState(false);

  function handleSubmit(values: TaskFormValues) {
    setProcessing(true);
    const callbacks = {
      onSuccess: () => {
        setProcessing(false);
        onSuccess();
      },
      onError: () => setProcessing(false),
    };

    if (task) {
      router.put(route('tasks.update', task.id), values, callbacks);
    } else {
      router.post(route('tasks.store'), values, callbacks);
    }
  }

  function handleDelete() {
    router.delete(route('tasks.destroy', task!.id), {
      preserveScroll: true,
      onSuccess,
    });
  }

  const defaultValues: Partial<TaskFormValues> = task
    ? {
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        due_date: task.due_date,
      }
    : { status: 'pending', priority: 'medium' };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="flex w-full flex-col overflow-y-auto sm:max-w-md"
        side="right"
      >
        <SheetHeader>
          <SheetTitle data-slot="sheet-title">
            {task ? task.title : 'New Task'}
          </SheetTitle>
          {task && (
            <SheetDescription className="flex items-center gap-2">
              <TaskStatusBadge status={task.status} />
              <span className="text-xs text-muted-foreground">
                Updated {new Date(task.updated_at).toLocaleDateString()}
              </span>
            </SheetDescription>
          )}
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-6 p-4">
          <TaskForm
            key={task?.id ?? 'new'}
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            isSubmitting={processing}
            submitLabel={task ? 'Update Task' : 'Create Task'}
            showCancel={false}
          />

          {task && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive" className="mt-auto">
                  <TrashIcon className="mr-1" />
                  Delete task
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete task?</AlertDialogTitle>
                  <AlertDialogDescription>
                    &ldquo;{task.title}&rdquo; will be permanently deleted. This
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={handleDelete}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

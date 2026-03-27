import { Link } from '@inertiajs/react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/ui/select';
import { Textarea } from '@/Components/ui/textarea';
import { taskSchema, TaskFormValues } from '@/schemas/task';
import { TASK_PRIORITIES, TASK_STATUSES } from '@/types/task';

interface TaskFormProps {
  defaultValues?: Partial<TaskFormValues>;
  onSubmit: (values: TaskFormValues) => void;
  isSubmitting: boolean;
  submitLabel: string;
  /** Set to false to hide the Cancel link (e.g. when inside a Sheet) */
  showCancel?: boolean;
}

export default function TaskForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel,
  showCancel = true,
}: TaskFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      status: 'pending',
      priority: 'medium',
      description: null,
      due_date: null,
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {/* Title */}
      <div className="flex flex-col gap-1">
        <label htmlFor="title" className="text-sm font-medium">
          Title
        </label>
        <Input id="title" {...register('title')} placeholder="Task title" />
        {errors.title && (
          <p className="text-xs text-destructive">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Description</label>
        <Textarea
          {...register('description')}
          placeholder="Optional description"
          rows={3}
        />
        {errors.description && (
          <p className="text-xs text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Status */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Status</label>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {TASK_STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.status && (
          <p className="text-xs text-destructive">{errors.status.message}</p>
        )}
      </div>

      {/* Priority */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Priority</label>
        <Controller
          name="priority"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                {TASK_PRIORITIES.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.priority && (
          <p className="text-xs text-destructive">{errors.priority.message}</p>
        )}
      </div>

      {/* Due date */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Due date</label>
        <Input type="date" {...register('due_date')} />
        {errors.due_date && (
          <p className="text-xs text-destructive">{errors.due_date.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="mt-2">
        {isSubmitting ? 'Saving…' : submitLabel}
      </Button>

      {showCancel && (
        <Link
          href={route('tasks.index')}
          className="text-center text-sm text-muted-foreground hover:underline"
        >
          Cancel
        </Link>
      )}
    </form>
  );
}

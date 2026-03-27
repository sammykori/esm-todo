import type { PageProps as BasePageProps } from '@/types';

export type TaskStatus = 'pending' | 'in_progress' | 'complete';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  status_label: string;
  priority: TaskPriority;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export const TASK_STATUSES: { value: TaskStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'complete', label: 'Complete' },
];

export const TASK_PRIORITIES: { value: TaskPriority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export type PageProps = BasePageProps<{
  tasks?: Task[];
  task?: Task;
  flash?: { success?: string; error?: string };
}>;

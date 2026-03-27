import { z } from 'zod';

import { TASK_PRIORITIES, TASK_STATUSES } from '@/types/task';

const statusValues = TASK_STATUSES.map((s) => s.value) as [
  'pending',
  'in_progress',
  'complete',
];
const priorityValues = TASK_PRIORITIES.map((p) => p.value) as [
  'low',
  'medium',
  'high',
];

export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().max(2000).nullish(),
  status: z.enum(statusValues),
  priority: z.enum(priorityValues),
  due_date: z.string().nullish(),
});

export type TaskFormValues = z.infer<typeof taskSchema>;

import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TaskSheet from '../TaskSheet';
import { Task } from '@/types/task';

vi.stubGlobal('route', (name: string, params?: unknown) => {
  if (params) return `/${name}/${params}`;
  return `/${name}`;
});

vi.mock('@inertiajs/react', () => ({
  router: { post: vi.fn(), put: vi.fn(), delete: vi.fn() },
  Link: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

const mockTask: Task = {
  id: 'abc-123',
  title: 'My existing task',
  description: 'A description',
  status: 'in_progress',
  status_label: 'In Progress',
  priority: 'medium',
  due_date: '2024-06-01',
  created_at: '2024-01-01 00:00:00',
  updated_at: '2024-03-15 12:00:00',
};

const baseProps = {
  open: true,
  onOpenChange: vi.fn(),
  onSuccess: vi.fn(),
};

describe('TaskSheet', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders "New Task" title when no task is provided', () => {
    render(<TaskSheet {...baseProps} task={null} />);
    const dialog = screen.getByRole('dialog');
    expect(
      within(dialog).getByRole('heading', { name: /new task/i })
    ).toBeInTheDocument();
  });

  it('renders the task title when a task is provided', () => {
    render(<TaskSheet {...baseProps} task={mockTask} />);
    const dialog = screen.getByRole('dialog');
    expect(
      within(dialog).getByRole('heading', { name: /my existing task/i })
    ).toBeInTheDocument();
  });

  it('renders the TaskForm inside the sheet', () => {
    render(<TaskSheet {...baseProps} task={null} />);
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByLabelText(/title/i)).toBeInTheDocument();
  });

  it('does not show a Delete button when no task is provided', () => {
    render(<TaskSheet {...baseProps} task={null} />);
    expect(
      screen.queryByRole('button', { name: /delete task/i })
    ).not.toBeInTheDocument();
  });

  it('shows a Delete button when a task is provided', () => {
    render(<TaskSheet {...baseProps} task={mockTask} />);
    expect(
      screen.getByRole('button', { name: /delete task/i })
    ).toBeInTheDocument();
  });

  it('clicking Delete opens the AlertDialog confirmation', async () => {
    const user = userEvent.setup();
    render(<TaskSheet {...baseProps} task={mockTask} />);
    await user.click(screen.getByRole('button', { name: /delete task/i }));
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    expect(
      screen.getByText(/will be permanently deleted/i)
    ).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Index from '../Index';
import { Task } from '@/types/task';

// ---------------------------------------------------------------------------
// Global mocks
// ---------------------------------------------------------------------------

// Ziggy route() helper — return a stable string
vi.stubGlobal('route', (name: string, params?: unknown) => {
  if (params) return `/${name}/${params}`;
  return `/${name}`;
});

// Mock Inertia — usePage returns controlled props; Head is a no-op
vi.mock('@inertiajs/react', () => ({
  usePage: vi.fn(),
  Head: ({ title }: { title: string }) => <title>{title}</title>,
  router: {
    delete: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    visit: vi.fn(),
  },
  Link: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

import { usePage } from '@inertiajs/react';

const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Write unit tests',
    description: null,
    status: 'pending',
    status_label: 'Pending',
    priority: 'high',
    due_date: null,
    created_at: '2024-01-01 00:00:00',
    updated_at: '2024-01-01 00:00:00',
  },
  {
    id: 'task-2',
    title: 'Fix production bug',
    description: 'Critical issue',
    status: 'in_progress',
    status_label: 'In Progress',
    priority: 'high',
    due_date: '2024-12-31',
    created_at: '2024-01-01 00:00:00',
    updated_at: '2024-01-01 00:00:00',
  },
];

function setupPage(tasks: Task[] = mockTasks) {
  vi.mocked(usePage).mockReturnValue({
    props: {
      tasks,
      flash: undefined,
      auth: { user: { id: 1, name: 'Test', email: 't@t.com' } },
    },
  } as ReturnType<typeof usePage>);
}

describe('Tasks/Index', () => {
  beforeEach(() => {
    setupPage();
  });

  it('renders task titles in the table', () => {
    render(<Index />);
    expect(screen.getByText('Write unit tests')).toBeInTheDocument();
    expect(screen.getByText('Fix production bug')).toBeInTheDocument();
  });

  it('renders the New Task button', () => {
    render(<Index />);
    expect(
      screen.getByRole('button', { name: /new task/i })
    ).toBeInTheDocument();
  });

  it('clicking the edit icon opens the sheet for that task', async () => {
    const user = userEvent.setup();
    render(<Index />);
    const editButtons = screen.getAllByRole('button', { name: /edit task/i });
    await user.click(editButtons[0]);
    // Sheet (dialog role) should be open; heading shows the task title
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent('Write unit tests');
  });

  it('clicking New Task opens the sheet with "New Task" heading', async () => {
    const user = userEvent.setup();
    render(<Index />);
    await user.click(screen.getByRole('button', { name: /new task/i }));
    // Dialog should be open with "New Task" as the heading
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /new task/i })
    ).toBeInTheDocument();
  });
});

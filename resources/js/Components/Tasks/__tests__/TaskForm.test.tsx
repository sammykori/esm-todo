import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TaskForm from '../TaskForm';

vi.stubGlobal('route', (name: string) => `/${name}`);

vi.mock('@inertiajs/react', () => ({
  Link: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

const baseProps = {
  onSubmit: vi.fn(),
  isSubmitting: false,
  submitLabel: 'Create Task',
};

describe('TaskForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all fields', () => {
    render(<TaskForm {...baseProps} />);
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/optional description/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/^status$/i)).toBeInTheDocument();
    expect(screen.getByText(/^priority$/i)).toBeInTheDocument();
    expect(screen.getByText(/due date/i)).toBeInTheDocument();
  });

  it('shows a validation error when title is empty and form is submitted', async () => {
    // Providing title: '' means zodResolver sees '' → min(1) error fires
    const { container } = render(
      <TaskForm
        {...baseProps}
        defaultValues={{ title: '', status: 'pending', priority: 'medium' }}
      />
    );
    await act(async () => {
      fireEvent.submit(container.querySelector('form')!);
    });
    expect(await screen.findByText(/title is required/i)).toBeInTheDocument();
  });

  it('calls onSubmit with correct values when form is valid', async () => {
    const onSubmit = vi.fn();
    const { container } = render(
      <TaskForm
        {...baseProps}
        onSubmit={onSubmit}
        defaultValues={{
          title: 'My new task',
          status: 'pending',
          priority: 'medium',
        }}
      />
    );
    await act(async () => {
      fireEvent.submit(container.querySelector('form')!);
    });
    await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce());
    expect(onSubmit.mock.calls[0][0]).toMatchObject({ title: 'My new task' });
  });

  it('shows "Saving…" when isSubmitting is true', () => {
    render(<TaskForm {...baseProps} isSubmitting={true} />);
    expect(screen.getByRole('button', { name: /saving/i })).toBeInTheDocument();
  });

  it('renders the Cancel link when showCancel is true', () => {
    render(<TaskForm {...baseProps} showCancel={true} />);
    expect(screen.getByRole('link', { name: /cancel/i })).toBeInTheDocument();
  });

  it('does not render the Cancel link when showCancel is false', () => {
    render(<TaskForm {...baseProps} showCancel={false} />);
    expect(
      screen.queryByRole('link', { name: /cancel/i })
    ).not.toBeInTheDocument();
  });
});

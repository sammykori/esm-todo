import { Link, usePage } from '@inertiajs/react';

import { Alert, AlertDescription } from '@/Components/ui/alert';
import { Button } from '@/Components/ui/button';
import { PageProps } from '@/types/task';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { flash } = usePage<PageProps>().props;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link
            href={route('tasks.index')}
            className="text-sm font-semibold tracking-tight hover:opacity-80"
          >
            Task Manager
          </Link>
          <Button asChild size="sm">
            <Link href={route('tasks.create')}>New Task</Link>
          </Button>
        </div>
      </header>

      {(flash?.success || flash?.error) && (
        <div className="mx-auto max-w-5xl px-4 pt-4">
          {flash.success && (
            <Alert className="border-green-200 bg-green-50 text-green-800">
              <AlertDescription>{flash.success}</AlertDescription>
            </Alert>
          )}
          {flash.error && (
            <Alert variant="destructive">
              <AlertDescription>{flash.error}</AlertDescription>
            </Alert>
          )}
        </div>
      )}

      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}

# ESM Task Manager

A full-stack Task / To-Do Manager built as a technical assessment for Earthstorm Media.
Built with Laravel 11, Inertia.js, React, TypeScript, and PostgreSQL.

---

## Tech Stack

| Layer             | Technology            | Reason                                                                                       |
| ----------------- | --------------------- | -------------------------------------------------------------------------------------------- |
| Backend framework | Laravel 11            | Mature, opinionated PHP framework with excellent ORM, validation, and routing out of the box |
| Frontend          | React + TypeScript    | Component-driven UI with full type safety across the stack                                   |
| Bridge            | Inertia.js            | Eliminates the need for a separate REST API while retaining a full React frontend            |
| Database          | PostgreSQL/MySQL      | Robust relational database with strong support for UUIDs and JSON                            |
| Styling           | Tailwind CSS          | Utility-first CSS that keeps styles co-located with components                               |
| UI primitives     | shadcn/ui             | Accessible, unstyled-by-default components that integrate cleanly with Tailwind              |
| Form validation   | React Hook Form + Zod | Schema-driven validation with TypeScript type inference from the schema                      |
| Table             | TanStack Table v8     | Headless table with built-in sorting and filtering, no styling opinions                      |

---

## Prerequisites

- PHP 8.2+
- Composer
- Node.js 20+
- PostgreSQL 15+

---

## Setup

**1. Clone the repository**

```bash
git clone <repository-url>
cd task-manager
```

**2. Install dependencies**

```bash
composer install
npm install
```

**3. Environment setup**

```bash
cp .env.example .env
php artisan key:generate
```

**4. Configure your database**

Open `.env` and set your PostgreSQL credentials:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=esm_todo
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

**5. Run migrations and seed the database**

```bash
php artisan migrate --seed
```

This creates the tasks table and seeds 12 example tasks.

**6. Start the development servers**

In two separate terminals:

```bash
php artisan serve
```

```bash
npm run dev
```

Visit [http://localhost:8000](http://localhost:8000)

---

## Running Tests

```bash
php artisan test
```

---

## CI/CD

GitHub Actions runs on every push and pull request to `main` and `development`.

The pipeline:

- Spins up a PostgreSQL service container
- Installs PHP and Node dependencies
- Runs database migrations against the test database
- Runs UI component tests
- Runs TypeScript type checking
- Runs ESLint

---

## Architecture

### Why Inertia.js instead of a separate API?

The brief called for a backend API or server-rendered pages. Inertia.js satisfies
the SSR requirement fully. Laravel handles routing, controllers, validation, and
data fetching exactly as it would for a traditional server-rendered app. Instead
of returning a Blade view, controllers return an Inertia response that is rendered
to full HTML by a Node.js SSR server before reaching the browser.

This means the first page load delivers completely server-rendered HTML. Crawlable,
fast to paint, and indistinguishable from a traditional server-rendered page. React
then hydrates on the client, giving subsequent navigation the speed of a SPA without
sacrificing the first-load benefits of SSR. The root route serves the task list
directly with no redirect, keeping the initial response as lean as possible.

This means:

- No CORS configuration
- No authentication tokens to manage
- No duplicated validation logic between API and frontend
- A single deployment unit

For an application without a mobile client or third-party API consumers, a
standalone REST API would be unnecessary complexity.

### Thin controllers

Controllers are deliberately kept as traffic directors. They receive a request,
delegate to a service, and return a response. No business logic lives in a
controller.

```php
public function store(StoreTaskRequest $request): RedirectResponse
{
    $this->taskService->createTask($request->validated());
    return redirect()->route('tasks.index')->with('success', 'Task created.');
}
```

This means task creation logic is reachable from CLI commands, queue jobs, or
tests without going through an HTTP layer.

### Service layer

`TaskService` owns all business logic. It has no knowledge of HTTP, requests,
or responses — it works purely with data. This makes it independently testable
and reusable across any entry point.

### Enums

Task status and priority are backed enums rather than raw strings. This gives
type safety, IDE autocomplete, and a single source of truth for valid values.
The `label()` method on `TaskStatus` means display logic lives with the
definition, not scattered across components.

### Frontend separation of concerns

```
Pages/          — receive Inertia props, compose layout, no logic
Components/     — domain components (TaskForm, TaskTable, TaskStatusBadge)
Components/UI/  — generic primitives with no domain knowledge
schemas/        — Zod validation schemas, single source of truth
types/          — TypeScript interfaces and status/priority constants
```

React Hook Form owns field state and client-side validation. Inertia's `useForm`
handles the HTTP submission and surfaces server-side errors. The two are kept
separate — RHF never touches the network, Inertia never touches field state.

---

## Assumptions and Trade-offs

**Caching removed from TaskService**
An initial implementation cached the task list using Laravel's Cache facade.
This was removed after encountering serialization conflicts between PHP Backed
Enums and Laravel's database cache driver in the local environment. The correct
production solution is to use Redis as the cache store, which handles object
serialization correctly and would be the first addition before going live.
The architectural decision is documented here rather than hidden.

**Edit page serves as detail view**
The brief required list and detail views. A dedicated show page was omitted in
favour of the edit page serving both purposes. For a task manager this is a
reasonable UX decision — the detail and edit views would contain identical
information.

---

## Time Spent

Approximately 7 hours.

Breakdown:

- Project scaffolding and CI/CD setup: ~1 hour
- Data layer (model, migration, enums, factory, seeder): ~1.5 hours
- Backend (controller, service, requests, resource, routes): ~1.5 hours
- Frontend (pages, components, table, forms): ~2 hours
- Tests and documentation: ~1 hour

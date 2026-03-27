<?php

namespace App\Services;

use App\Models\Task;
use Illuminate\Support\Collection;

class TaskService
{
    /**
     * Return all tasks ordered by most recently created.
     */
    public function getAllTasks(): Collection
    {
        return Task::orderBy('created_at', 'desc')->get();
    }

    /**
     * Create a new task.
     */
    public function createTask(array $data): Task
    {
        return Task::create($data);
    }

    /**
     * Update an existing task.
     */
    public function updateTask(Task $task, array $data): Task
    {
        $task->update($data);
        return $task->fresh();
    }

    /**
     * Delete a task.
     */
    public function deleteTask(Task $task): void
    {
        $task->delete();
    }
}
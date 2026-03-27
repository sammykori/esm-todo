<?php

namespace App\Services;

use App\Models\Task;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

class TaskService
{
    private const CACHE_KEY = 'tasks.all';

    private const CACHE_TTL = 60; // seconds

    /**
     * Return all tasks, served from cache where possible.
     */
    public function getAllTasks(): Collection
    {
        return Cache::remember(self::CACHE_KEY, self::CACHE_TTL, function () {
            return Task::orderBy('created_at', 'desc')->get();
        });
    }

    /**
     * Create a new task and bust the cache.
     */
    public function createTask(array $data): Task
    {
        $task = Task::create($data);
        $this->bustCache();

        return $task;
    }

    /**
     * Update an existing task and bust the cache.
     */
    public function updateTask(Task $task, array $data): Task
    {
        $task->update($data);
        $this->bustCache();

        return $task->fresh(); // return reloaded model with updated timestamps
    }

    /**
     * Delete a task and bust the cache.
     */
    public function deleteTask(Task $task): void
    {
        $task->delete();
        $this->bustCache();
    }

    /**
     * Invalidate the task list cache on any write operation.
     */
    private function bustCache(): void
    {
        Cache::forget(self::CACHE_KEY);
    }
}

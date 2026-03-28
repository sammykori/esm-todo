<?php

namespace App\Models;

use App\Enums\TaskPriority;
use App\Enums\TaskStatus;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'title',
        'description',
        'status',
        'priority',
        'due_date',
    ];

    /**
     * Cast raw DB strings to typed PHP enums and proper types.
     */
    protected function casts(): array
    {
        return [
            'status' => TaskStatus::class,
            'priority' => TaskPriority::class,
            'due_date' => 'date',
        ];
    }

    // --- Scopes ---

    /** Filter to only pending tasks. */
    public function scopePending($query)
    {
        return $query->where('status', TaskStatus::Pending);
    }

    /** Filter by a given status. */
    public function scopeByStatus($query, TaskStatus $status)
    {
        return $query->where('status', $status);
    }
}

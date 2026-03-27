<?php

namespace Database\Factories;

use App\Enums\TaskPriority;
use App\Enums\TaskStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

class TaskFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(4),
            'description' => $this->faker->optional()->paragraph(),
            'status' => $this->faker->randomElement(TaskStatus::cases()),
            'priority' => $this->faker->randomElement(TaskPriority::cases()),
            'due_date' => $this->faker->optional()->dateTimeBetween('now', '+30 days'),
        ];
    }

    // Named states for tests
    public function pending(): static
    {
        return $this->state(['status' => TaskStatus::Pending]);
    }

    public function complete(): static
    {
        return $this->state(['status' => TaskStatus::Complete]);
    }
}

<?php

use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('tasks.index');
});

// Generates: index, create, store, edit, update, destroy except show
Route::resource('tasks', TaskController::class)->except(['show']);

require __DIR__.'/auth.php';

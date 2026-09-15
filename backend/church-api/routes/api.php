<?php

use App\Http\Controllers\Api\EventController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChurchController;
use App\Http\Controllers\PastorController;
use App\Http\Controllers\DirectorController;
use App\Http\Controllers\ParticipantController;
use App\Http\Controllers\SecretaryController;
use App\Http\Controllers\Api\ReportController;

// routes/api.php
Route::middleware(['auth:sanctum', 'role:church_representative'])->group(function () {
    Route::get('church_representative/home', [ReportController::class, 'getPrograms']);
    Route::get('church_representative/event', [EventController::class, 'getEvents']);
    Route::get('church_representative/event/{id}', [EventController::class, 'getEvents']);
    Route::put('church_representative/event/manage_event/{id}', [EventController::class, 'manageEvent']);
    Route::post('church_representative/report-value',[ReportController::class, 'saveReportValue']);
    Route::post('church_representative/save-event', [EventController::class, 'createEvent']);
    Route::apiResource('church_representative', ChurchController::class);
});

Route::middleware(['auth:sanctum', 'role:pastor'])->group(function () {
    Route::apiResource('pastor', PastorController::class);
});

Route::middleware(['auth:sanctum', 'role:director'])->group(function () {
    Route::apiResource('director', DirectorController::class);
});

Route::middleware(['auth:sanctum', 'role:participant'])->group(function () {
    Route::apiResource('participant', ParticipantController::class);
});

Route::middleware(['auth:sanctum', 'role:secretary'])->group(function () {
    Route::apiResource('secretary', SecretaryController::class);
});


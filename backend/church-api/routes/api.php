<?php

use App\Http\Controllers\Api\AnnouncementController;
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
use App\Http\Controllers\Api\StewardshipController;
use App\Http\Controllers\Api\ManageRoleController;
use App\Http\Controllers\Api\ReportMonitoringController;

// routes/api.php

// Church Representative
Route::middleware(['auth:sanctum', 'role:church_representative'])->group(function () {
    // GET
    Route::get('church_representative/home', [ReportController::class, 'getPrograms']);
    Route::get('church_representative/event', [EventController::class, 'getEvents']);
    Route::get('church_representative/event/participants', [EventController::class, 'viewParticipants']);
    Route::get('church_representative/event/{id}', [EventController::class, 'getEvents']);
    Route::get('church_representative/announcements', [AnnouncementController::class, 'viewAnnouncements']);
    Route::get('church_representative/stewardship', [StewardshipController::class, 'stewardshipParticular']);
    Route::get('church_representative/manage-roles', [ManageRoleController::class, 'index']);
    Route::get('church_representative/monitoring', [ReportMonitoringController::class, 'index']);

    // PUT
    Route::put('church_representative/event/manage_event/{id}', [EventController::class, 'manageEvent']);
    Route::put('church_representative/event/update/{id}', [EventController::class, 'updateEvent']);
        // MANAGE ROLES - ASSIGN DEPARTMENT
    Route::put('church_representative/manage-roles/{departmentId}', [ManageRoleController::class, 'assignUser']);

    // POST
    Route::post('church_representative/report-value',[ReportController::class, 'saveReportValue']);
    Route::post('church_representative/save-event', [EventController::class, 'createEvent']);
    Route::post('church_representative/stewardship/monthly-values', [StewardshipController::class, 'saveMonthlyValues']);
    Route::post('church_representative/manage-roles/add-user', [ManageRoleController::class, 'createUser']);

    //DELETE
    Route::delete('church_representative/event/participant/{participant_id}',[EventController::class, 'removeParticipant']);

    // Resource
    Route::apiResource('church_representative', ChurchController::class);
});

// Pastor
Route::middleware(['auth:sanctum', 'role:pastor'])->group(function () {
    Route::apiResource('pastor', PastorController::class);
});

// Director
Route::middleware(['auth:sanctum', 'role:director'])->group(function () {
    Route::apiResource('director', DirectorController::class);
});

// Secretary
Route::middleware(['auth:sanctum', 'role:secretary'])->group(function () {
    Route::apiResource('secretary', SecretaryController::class);
});

// Participant
Route::middleware(['auth:sanctum', 'role:participant'])->group(function () {
    Route::apiResource('participant', ParticipantController::class);
});



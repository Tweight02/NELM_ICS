<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\PastorController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    // Get currently authenticated user
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // Pastor API
    Route::apiResource('pastors', PastorController::class);
});

// Route::apiResource('pastors', PastorController::class);

// Route::get('pastor', [PastorController::class, 'getPastor']);

// Route::get('pastor/{id}', [PastorController::class, 'getPastorbyId']);

// Route::post('addPastor', [PastorController::class, 'addPastor']);

// Route::put('updatePastor/{id}', [PastorController::class, 'updatePastor']);

// Route::delete('deletePastor/{id}', [PastorController::class, 'deletePastor']);
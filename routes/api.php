<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\ChapterController;
use App\Http\Controllers\ChoiceController;
use App\Http\Controllers\StoryController;
use App\Http\Controllers\ProgressController;
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;

// CSRF Protection
Route::get('/sanctum/csrf-cookie', [CsrfCookieController::class, 'show']);

// Routes publiques
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Routes protégées
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    // Routes pour le jeu narratif
    Route::get('/chapters', [ChapterController::class, 'index']);
    Route::get('/chapters/{id}', [ChapterController::class, 'show']);
    Route::get('/chapters/{chapter}/choices', [ChoiceController::class, 'index']);
    Route::get('/stories', [StoryController::class, 'index']);
    Route::get('/stories/{id}', [StoryController::class, 'show']);
    Route::get('/stories/{id}/chapters', [ChapterController::class, 'getChaptersByStory']);
    
    // Routes protégées pour la gestion du contenu
    Route::post('/chapters', [ChapterController::class, 'store']);
    Route::put('/chapters/{id}', [ChapterController::class, 'update']);
    Route::delete('/chapters/{id}', [ChapterController::class, 'destroy']);
    
    Route::post('/stories', [StoryController::class, 'store']);
    Route::put('/stories/{id}', [StoryController::class, 'update']);
    Route::delete('/stories/{id}', [StoryController::class, 'destroy']);
    
    Route::post('/chapters/{chapter}/choices', [ChoiceController::class, 'store']);
    Route::put('/choices/{id}', [ChoiceController::class, 'update']);
    Route::delete('/choices/{id}', [ChoiceController::class, 'destroy']);

    // Routes pour la gestion de la progression
    Route::get('/progress', [ProgressController::class, 'index']);
    Route::post('/progress', [ProgressController::class, 'store']);
    Route::get('/progress/{progress}', [ProgressController::class, 'show']);
    Route::put('/progress/{progress}', [ProgressController::class, 'update']);
    Route::delete('/progress/{progress}', [ProgressController::class, 'destroy']);
});
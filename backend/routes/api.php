<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CompanyController;
use App\Http\Controllers\Api\JobController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\SeekerController;
use Illuminate\Support\Facades\Route;

// Public routes — rate limited
Route::post('/auth/register',         [AuthController::class, 'register'])->middleware('throttle:auth.register');
Route::post('/auth/login',            [AuthController::class, 'login'])->middleware('throttle:auth.login');
Route::post('/auth/forgot-password',  [AuthController::class, 'forgotPassword'])->middleware('throttle:auth.register');
Route::post('/auth/reset-password',   [AuthController::class, 'resetPassword'])->middleware('throttle:auth.register');

Route::get('/categories',    [AdminController::class, 'categories']);
Route::get('/jobs',          [JobController::class, 'index']);
Route::get('/jobs/{id}',     [JobController::class, 'show']);
Route::get('/companies',     [CompanyController::class, 'index']);
Route::get('/companies/{id}', [CompanyController::class, 'show']);
Route::get('/jobs/company/{companyId}', [JobController::class, 'byCompany']);

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout',          [AuthController::class, 'logout']);
    Route::get('/auth/me',               [AuthController::class, 'me']);
    Route::post('/auth/change-password', [AuthController::class, 'changePassword']);
    Route::get('/applications/{id}',     [ApplicationController::class, 'show']);

    // Notifications
    Route::get('/notifications',           [NotificationController::class, 'index']);
    Route::get('/notifications/unread',    [NotificationController::class, 'unreadCount']);
    Route::patch('/notifications/{id}/read', [NotificationController::class, 'markRead']);
    Route::patch('/notifications/read-all', [NotificationController::class, 'markAllRead']);

    // Messages
    Route::get('/messages/contacts',      [MessageController::class, 'contacts']);
    Route::get('/messages/unread',        [MessageController::class, 'unreadCount']);
    Route::get('/messages/{userId}',      [MessageController::class, 'thread']);
    Route::post('/messages',              [MessageController::class, 'send'])->middleware('throttle:30,1');

    // Seeker routes
    Route::middleware('role:seeker')->group(function () {
        Route::get('/seeker/profile',               [SeekerController::class, 'profile']);
        Route::put('/seeker/profile',               [SeekerController::class, 'updateProfile']);
        Route::post('/seeker/photo',                [SeekerController::class, 'uploadPhoto'])->middleware('throttle:uploads');
        Route::post('/seeker/resumes',              [SeekerController::class, 'uploadResume'])->middleware('throttle:uploads');
        Route::get('/seeker/resumes/{id}/download', [SeekerController::class, 'downloadResume']);
        Route::delete('/seeker/resumes/{id}',       [SeekerController::class, 'deleteResume']);
        Route::get('/seeker/saved-jobs',            [SeekerController::class, 'savedJobs']);
        Route::post('/seeker/saved-jobs/{jobId}',   [SeekerController::class, 'saveJob']);
        Route::delete('/seeker/saved-jobs/{jobId}', [SeekerController::class, 'unsaveJob']);
        Route::get('/seeker/applications',          [ApplicationController::class, 'myApplications']);
        Route::post('/jobs/{jobId}/apply',          [ApplicationController::class, 'apply']);
        Route::delete('/applications/{id}/withdraw', [ApplicationController::class, 'withdraw']);
    });

    // Employer routes
    Route::middleware('role:employer')->group(function () {
        Route::get('/employer/company',          [CompanyController::class, 'myCompany']);
        Route::put('/employer/company',          [CompanyController::class, 'updateCompany']);
        Route::post('/employer/company/logo',    [CompanyController::class, 'uploadLogo'])->middleware('throttle:uploads');
        Route::post('/employer/company/docs',    [CompanyController::class, 'uploadVerificationDoc'])->middleware('throttle:uploads');
        Route::get('/employer/dashboard',        [JobController::class, 'employerDashboard']);
        Route::get('/employer/jobs',             [JobController::class, 'myJobs']);
        Route::post('/employer/jobs',            [JobController::class, 'store']);
        Route::put('/employer/jobs/{id}',        [JobController::class, 'update']);
        Route::delete('/employer/jobs/{id}',     [JobController::class, 'destroy']);
        Route::get('/employer/jobs/{id}/applications', [ApplicationController::class, 'forJob']);
        Route::patch('/applications/{id}/status', [ApplicationController::class, 'updateStatus']);
    });

    // Admin routes
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/dashboard',                   [AdminController::class, 'dashboard']);
        Route::get('/users',                        [AdminController::class, 'users']);
        Route::patch('/users/{id}/ban',             [AdminController::class, 'banUser']);
        Route::patch('/users/{id}/unban',           [AdminController::class, 'unbanUser']);
        Route::get('/verifications',                [AdminController::class, 'pendingVerifications']);
        Route::patch('/companies/{id}/verify',      [AdminController::class, 'verifyCompany']);
        Route::get('/reports',                      [AdminController::class, 'reports']);
        Route::patch('/reports/{id}/resolve',       [AdminController::class, 'resolveReport']);
        Route::get('/jobs',                         [AdminController::class, 'allJobs']);
        Route::patch('/jobs/{id}/takedown',         [AdminController::class, 'takedownJob']);
        Route::get('/audit-logs',                   [AdminController::class, 'auditLogs']);
        Route::patch('/jobs/{id}/approve',          [AdminController::class, 'approveJob']);
        Route::get('/categories',                   [AdminController::class, 'categories']);
        Route::post('/categories',                  [AdminController::class, 'addCategory']);
        Route::delete('/categories/{id}',           [AdminController::class, 'deleteCategory']);
    });
});

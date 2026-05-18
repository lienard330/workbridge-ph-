<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        // Strict limit on login — 5 attempts per minute per IP+email combo
        RateLimiter::for('auth.login', function (Request $request) {
            return Limit::perMinute(5)
                ->by($request->input('email') . '|' . $request->ip())
                ->response(fn () => response()->json(
                    ['message' => 'Too many login attempts. Please wait a minute and try again.'], 429
                ));
        });

        // Register: 10 per minute per IP
        RateLimiter::for('auth.register', function (Request $request) {
            return Limit::perMinute(10)
                ->by($request->ip())
                ->response(fn () => response()->json(
                    ['message' => 'Too many registration attempts. Please slow down.'], 429
                ));
        });

        // General API: 120 requests per minute per authenticated user or IP
        RateLimiter::for('api', function (Request $request) {
            return $request->user()
                ? Limit::perMinute(120)->by($request->user()->id)
                : Limit::perMinute(60)->by($request->ip());
        });

        // File uploads: 20 per minute per user
        RateLimiter::for('uploads', function (Request $request) {
            return Limit::perMinute(20)
                ->by($request->user()?->id . '|' . $request->ip())
                ->response(fn () => response()->json(
                    ['message' => 'Too many uploads. Please wait a moment.'], 429
                ));
        });
    }
}

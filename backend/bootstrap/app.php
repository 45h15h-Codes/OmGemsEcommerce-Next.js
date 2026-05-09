<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Register custom middleware aliases for role-based access control.
        // Architecture: Two-layer authorization —
        //   check.role       → "Can this user enter this portal?"
        //   check.permission → "Can this user perform this action?"
        $middleware->alias([
            'check.permission' => \App\Http\Middleware\CheckPermission::class,
            'check.role'       => \App\Http\Middleware\CheckRole::class,
        ]);

        // Sanctum stateful domains for SPA cookie-based auth
        $middleware->statefulApi();
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Integrate Sentry or similar crash reporting
        $exceptions->reportable(function (Throwable $e) {
            // \Sentry\Laravel\Integration::captureUnhandledException($e);
            \Illuminate\Support\Facades\Log::error('Sentry captured: ' . $e->getMessage());
        });
    })->create();

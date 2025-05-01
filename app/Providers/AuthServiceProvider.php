<?php

namespace App\Providers;

use App\Models\Progress;
use App\Policies\ProgressPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Progress::class => ProgressPolicy::class,
    ];

    public function boot(): void
    {
        $this->registerPolicies();
    }
} 
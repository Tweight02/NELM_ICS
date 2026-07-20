<?php

namespace App\Providers;

use App\Domain\Models\Pastor;
use App\Domain\Policies\PastorPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
class PastorServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        //
        Gate::policy(Pastor::class, PastorPolicy::class);
    }
}
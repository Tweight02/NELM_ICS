<?php

namespace App\Domain\Policies;

use App\Domain\Models\Pastor;
use App\Models\User;

class PastorPolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct()
    {
        //
    }

    public function viewAny(User $user): bool
    {
        return true;
    }
    
    public function view(User $user, Pastor $pastor): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return true; // wide open for now, just testing the connection
    }

    public function update(User $user, Pastor $pastor): bool
    {
        return true;
    }

    public function delete(User $user, Pastor $pastor): bool
    {
        return true;
    }
}

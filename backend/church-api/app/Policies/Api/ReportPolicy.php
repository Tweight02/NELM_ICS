<?php

namespace App\Policies\Api;

use App\Models\User;
use App\Models\ParticularItem;

class ReportPolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct()
    {
        //
    }
    /**
     * Anyone authenticated can view the list / individual reports.
     */
    public function viewAny(?User $user): bool
    {
        return $user !== null; // adjust if some roles shouldn't see reports at all
    }

    public function view(User $user, ParticularItem $report): bool
    {
        return $user !== null && $report !== null; // same as above — narrow this if reports are scoped per church
    }

    /**
     * Only Pastor and Church Representative can create.
     */
    public function create(User $user): bool
    {
        return in_array($user->role, ['pastor', 'church_representative']);
    }

    /**
     * Only Pastor and Church Representative can edit.
     */
    public function update(User $user, ParticularItem $report): bool
    {
        return in_array($user->role, ['pastor', 'church_representative']);
    }

    /**
     * Same restriction for delete — adjust if you want this stricter (e.g. Pastor only).
     */
    public function delete(User $user, ParticularItem $report): bool
    {
        return in_array($user->role, ['pastor', 'church_representative']);
    }
}

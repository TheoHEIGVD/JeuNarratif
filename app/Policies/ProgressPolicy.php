<?php

namespace App\Policies;

use App\Models\Progress;
use App\Models\User;

class ProgressPolicy
{
    public function view(User $user, Progress $progress)
    {
        return $user->id === $progress->user_id;
    }

    public function update(User $user, Progress $progress)
    {
        return $user->id === $progress->user_id;
    }

    public function delete(User $user, Progress $progress)
    {
        return $user->id === $progress->user_id;
    }
} 
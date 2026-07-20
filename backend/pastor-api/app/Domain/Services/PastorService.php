<?php

namespace App\Domain\Services;

use App\Domain\Models\Pastor;

class PastorService
{
    /**
     * Create a new pastor record.
     */
    public function create(array $data): Pastor
    {
        return Pastor::create($data);
    }

    /**
     * Update an existing pastor record.
     */
    public function update(Pastor $pastor, array $data): Pastor
    {
        $pastor->update($data);

        return $pastor->fresh();
    }

    /**
     * Delete a pastor record.
     */
    public function delete(Pastor $pastor): void
    {
        $pastor->delete();
    }
}
<?php

namespace App\Domain\Controllers;

use App\Http\Controllers\Controller;
use App\Domain\Models\Pastor;
use App\Domain\Requests\StorePastorRequest;
use App\Domain\Requests\UpdatePastorRequest;
use App\Domain\Resources\PastorResource;
use App\Domain\Services\PastorService;


class PastorController extends Controller
{
    public function __construct(private PastorService $service) {}

    public function index()
    {
        $this->authorize('viewAny', Pastor::class);

        return PastorResource::collection(Pastor::paginate(20));
    }

    public function store(StorePastorRequest $request)
    {
        $this->authorize('create', Pastor::class);

        $pastor = $this->service->create($request->validated());

        return new PastorResource($pastor);
    }

    public function show(Pastor $pastor)
    {
        $this->authorize('view', $pastor);

        return new PastorResource($pastor);
    }

    public function update(UpdatePastorRequest $request, Pastor $pastor)
    {
        $this->authorize('update', $pastor);

        $pastor = $this->service->update($pastor, $request->validated());

        return new PastorResource($pastor);
    }

    public function destroy(Pastor $pastor)
    {
        $this->authorize('delete', $pastor);

        $this->service->delete($pastor);

        return response()->noContent();
    }
}
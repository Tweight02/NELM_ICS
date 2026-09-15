<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class SecretaryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        return response()->json(User::where('role', 'secretary'), 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $data = $request->all();
        $data['role'] = 'secretary'; // enforce role, don't trust the request body for this
        $secretary = User::create($data);
        return response()->json($secretary, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
        $secretary = User::where('role', 'secretary')->find($id);
        if (is_null($secretary)) {
            return response()->json(['message' => 'Secretary not found.'], 404);
        }
        return response()->json($secretary, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
        $secretary = User::where('role', 'secretary')->find($id);
        if (is_null($secretary)) {
            return response()->json(['message' => 'Secretary not found.'], 404);
        }
        $data = $request->except('role'); // don't let the role be overwritten via update
        $secretary->update($data);
        return response()->json($secretary, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        $secretary = User::where('role', 'secretary')->find($id);
        if (is_null($secretary)) {
            return response()->json(['message' => 'Secretary not found.'], 404);
        }
        $secretary->delete();
        return response()->json(null, 204);
    }
}
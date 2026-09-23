<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class DirectorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        return response()->json(User::where('role', 'director'), 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $data = $request->all();
        $data['role'] = 'director'; // enforce role, don't trust the request body for this
        $director = User::create($data);
        return response()->json($director, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
        $director = User::where('role', 'director')->find($id);
        if (is_null($director)) {
            return response()->json(['message' => 'Director not found.'], 404);
        }
        return response()->json($director, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
        $director = User::where('role', 'director')->find($id);
        if (is_null($director)) {
            return response()->json(['message' => 'Director not found.'], 404);
        }
        $data = $request->except('role'); // don't let the role be overwritten via update
        $director->update($data);
        return response()->json($director, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        $director = User::where('role', 'director')->find($id);
        if (is_null($director)) {
            return response()->json(['message' => 'Director not found.'], 404);
        }
        $director->delete();
        return response()->json(null, 204);
    }
}
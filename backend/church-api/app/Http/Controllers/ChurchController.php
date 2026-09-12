<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class ChurchController extends Controller
{
    private const ROLE = 'church_representative';

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(User::where('role', self::ROLE)->get(), 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
        ]);

        $validated['role'] = self::ROLE; // enforce role, don't trust the request body for this
        $churchRep = User::create($validated);

        return response()->json($churchRep, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $churchRep = User::where('role', self::ROLE)->find($id);
        if (is_null($churchRep)) {
            return response()->json(['message' => 'Church representative not found.'], 404);
        }
        return response()->json($churchRep, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $churchRep = User::where('role', self::ROLE)->find($id);
        if (is_null($churchRep)) {
            return response()->json(['message' => 'Church representative not found.'], 404);
        }

        $validated = $request->validate([
            'first_name'     => 'sometimes|string|max:255',
            'email'    => 'sometimes|email|unique:users,email,' . $id,
            'password' => 'sometimes|string|min:8',
        ]);

        $churchRep->update($validated); // 'role' isn't in $validated, so it can't be overwritten

        return response()->json($churchRep, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $churchRep = User::where('role', self::ROLE)->find($id);
        if (is_null($churchRep)) {
            return response()->json(['message' => 'Church representative not found.'], 404);
        }
        $churchRep->delete();

        return response()->json(null, 204);
    }
}
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class ParticipantController extends Controller
{
    private const ROLE = 'participant';

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
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
        ]);

        $validated['role'] = self::ROLE;
        $participant = User::create($validated);

        return response()->json($participant, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $participant = User::where('role', self::ROLE)->find($id);
        if (is_null($participant)) {
            return response()->json(['message' => 'Participant not found.'], 404);
        }
        return response()->json($participant, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $participant = User::where('role', self::ROLE)->find($id);
        if (is_null($participant)) {
            return response()->json(['message' => 'Participant not found.'], 404);
        }

        $validated = $request->validate([
            'name'     => 'sometimes|string|max:255',
            'email'    => 'sometimes|email|unique:users,email,' . $id,
            'password' => 'sometimes|string|min:8',
        ]);

        $participant->update($validated);

        return response()->json($participant, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $participant = User::where('role', self::ROLE)->find($id);
        if (is_null($participant)) {
            return response()->json(['message' => 'Participant not found.'], 404);
        }
        $participant->delete();

        return response()->json(null, 204);
    }
}
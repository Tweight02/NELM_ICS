<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class ParticipantController extends Controller
{
    private const ROLE = 'participant';

    public function index()
    {
        return response()->json(User::where('role', self::ROLE)->get(), 200);
    }

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

    public function show($id)
    {
        $participant = User::where('role', self::ROLE)->find($id);
        if (is_null($participant)) {
            return response()->json(['message' => 'Participant not found.'], 404);
        }
        return response()->json($participant, 200);
    }

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
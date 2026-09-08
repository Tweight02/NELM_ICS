<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class DirectorController extends Controller
{
    private const ROLE = 'director';

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
        $director = User::create($validated);

        return response()->json($director, 201);
    }

    public function show($id)
    {
        $director = User::where('role', self::ROLE)->find($id);
        if (is_null($director)) {
            return response()->json(['message' => 'Director not found.'], 404);
        }
        return response()->json($director, 200);
    }

    public function update(Request $request, string $id)
    {
        $director = User::where('role', self::ROLE)->find($id);
        if (is_null($director)) {
            return response()->json(['message' => 'Director not found.'], 404);
        }

        $validated = $request->validate([
            'name'     => 'sometimes|string|max:255',
            'email'    => 'sometimes|email|unique:users,email,' . $id,
            'password' => 'sometimes|string|min:8',
        ]);

        $director->update($validated);

        return response()->json($director, 200);
    }

    public function destroy(string $id)
    {
        $director = User::where('role', self::ROLE)->find($id);
        if (is_null($director)) {
            return response()->json(['message' => 'Director not found.'], 404);
        }
        $director->delete();

        return response()->json(null, 204);
    }
}
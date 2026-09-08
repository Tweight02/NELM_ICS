<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class PastorController extends Controller
{
    private const ROLE = 'pastor';

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
        $pastor = User::create($validated);

        return response()->json($pastor, 201);
    }

    public function show($id)
    {
        $pastor = User::where('role', self::ROLE)->find($id);
        if (is_null($pastor)) {
            return response()->json(['message' => 'Pastor not found.'], 404);
        }
        return response()->json($pastor, 200);
    }

    public function update(Request $request, string $id)
    {
        $pastor = User::where('role', self::ROLE)->find($id);
        if (is_null($pastor)) {
            return response()->json(['message' => 'Pastor not found.'], 404);
        }

        $validated = $request->validate([
            'name'     => 'sometimes|string|max:255',
            'email'    => 'sometimes|email|unique:users,email,' . $id,
            'password' => 'sometimes|string|min:8',
        ]);

        $pastor->update($validated);

        return response()->json($pastor, 200);
    }

    public function destroy(string $id)
    {
        $pastor = User::where('role', self::ROLE)->find($id);
        if (is_null($pastor)) {
            return response()->json(['message' => 'Pastor not found.'], 404);
        }
        $pastor->delete();

        return response()->json(null, 204);
    }
}
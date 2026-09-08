<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class SecretaryController extends Controller
{
    private const ROLE = 'secretary';

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
        $secretary = User::create($validated);

        return response()->json($secretary, 201);
    }

    public function show($id)
    {
        $secretary = User::where('role', self::ROLE)->find($id);
        if (is_null($secretary)) {
            return response()->json(['message' => 'Secretary not found.'], 404);
        }
        return response()->json($secretary, 200);
    }

    public function update(Request $request, string $id)
    {
        $secretary = User::where('role', self::ROLE)->find($id);
        if (is_null($secretary)) {
            return response()->json(['message' => 'Secretary not found.'], 404);
        }

        $validated = $request->validate([
            'name'     => 'sometimes|string|max:255',
            'email'    => 'sometimes|email|unique:users,email,' . $id,
            'password' => 'sometimes|string|min:8',
        ]);

        $secretary->update($validated);

        return response()->json($secretary, 200);
    }

    public function destroy(string $id)
    {
        $secretary = User::where('role', self::ROLE)->find($id);
        if (is_null($secretary)) {
            return response()->json(['message' => 'Secretary not found.'], 404);
        }
        $secretary->delete();

        return response()->json(null, 204);
    }
}
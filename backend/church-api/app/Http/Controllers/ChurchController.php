<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class ChurchController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        return response()->json(User::where('role','church_representative'), 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $data = $request->all();
        $data['role'] = 'church_rep'; // enforce role, don't trust the request body for this
        $churchRep = User::create($data);
        return response()->json($churchRep, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        //
        $churchRep = User::where('role', 'church_rep')->find($id);
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
        //
        $churchRep = User::where('role', 'church_rep')->find($id);
        if (is_null($churchRep)) {
            return response()->json(['message' => 'Church representative not found.'], 404);
        }
        $churchRep->update($request->all());
        return response()->json($churchRep, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        $churchRep = User::where('role', 'church_rep')->find($id);
        if (is_null($churchRep)) {
            return response()->json(['message' => 'Church representative not found.'], 404);
        }
        $churchRep->delete();
        return response()->json(null, 204);
    }
}

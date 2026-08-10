<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class PastorController extends Controller
{
    //
    public function getPastor(){
        return response()->json(User::where('role','pastor')->get(), 200);
    }

    public function getPastorbyId($id) {
        $pastor = User::find($id);
        if(is_null($pastor)){
            return response()->json(['message' => 'Pastor not found.'], 404);
        }
        return response()->json($pastor::find($id), 200);
    }

    public function addPastor(Request $request){
        $pastor = User::create($request->all());
        return response($pastor, 201);
    }

    public function updatePastor(Request $request, $id) {
        $pastor = User::find($id);
        if(is_null($pastor)){
            return response()->json(['message' => 'Pastor not found.'], 404);
        }
        $pastor -> update($request->all());
        return response($pastor, 200);
    }

    public function deletePastor(Request $request, $id){
        $pastor = User::find($id);
        if(is_null($pastor)){
            return response()->json(['message' => 'Pastor not found.'], 404);
        }
        $pastor->delete();
        return response()->json(null, 204);
    }
}

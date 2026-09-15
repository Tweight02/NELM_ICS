<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Validation\Validator;
use Carbon\Carbon;

class EventController extends Controller
{
    //
    public function createEvent(Request $request){
        $validated = $request->validate([
            'title' => ['required', 'string'],
            'date_start' => ['required', 'date'],
            'date_end' => ['required', 'date'],
            'description' => ['required', 'string'],
            'address' => ['required', 'string'],
            'time' => ['required']
        ]);

        $event = Event::updateOrCreate(
            [   
                'par_item_id' => 1,
                'type' => 'ChurchOnly',
                'title' => $validated['title'],
                'date_start' => $validated['date_start'],
                'date_end' => $validated['date_end'],
                'description' => $validated['description'],
                'status' => 'upcoming',
                'time' => $validated['time'],
                'address' => $validated['address'],
            ]   
        );

        return response()->json([
            'message' => 'Event saved',
            'event' => $event
        ]);
    }

    public function getEvents(Request $request){
        $month = $request->query('month');
        $monthStart = $month ? Carbon::parse($month.'-01'): now() ->startOfMonth();
        $monthStart = $monthStart->copy()->startOfMonth();
        $monthEnd = $monthStart->copy()->endOfMonth();

        $events = Event::whereBetween('date_start', [$monthStart, $monthEnd])->get();

        return response()->json(['events' => $events]);
    }

    public function specificEvents(){
        
    }

    public function manageEvent(Request $request, $id)
    {
        $event = Event::find($id);

        if (!$event) {
            return response()->json([
                'message' => 'Event not found.'
            ], 404);
        }

        $validated = $request->validate([
            'type' => ['nullable', 'string'],
            'title' => ['required', 'string', 'max:255'],
            'date_start' => ['required', 'date'],
            'date_end' => ['required', 'date', 'after_or_equal:date_start'],
            'description' => ['nullable', 'string'],
            'status' => ['nullable', 'string'],
            'time' => ['nullable'],
            'address' => ['nullable', 'string'],
        ]);

        $event->update($validated);

        return response()->json([
            'message' => 'Event updated successfully.',
            'event' => $event
        ]);
    }
}

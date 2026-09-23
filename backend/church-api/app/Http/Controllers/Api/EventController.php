<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Participant;
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

    public function viewParticipants(Request $request)
    {
        $request->validate([
            'event_id' => 'required|integer',
        ]);

        $participants = Participant::where(
            'event_id',
            $request->event_id
        )
        ->with('church')
        ->get();

        return response()->json([
            'event_id' => $request->event_id,
            'count' => $participants->count(),
            'participants' => $participants,
        ]);
    }

    public function updateEvent(Request $request, $id)
    {
        $request->validate([
            'type' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'date_start' => 'required|date',
            'date_end' => 'required|date|after_or_equal:date_start',
            'description' => 'required|string|max:255',
            'status' => 'required|string|max:255',
            'time' => 'required',
            'address' => 'required|string|max:255',
        ]);
        $event = Event::find($id);
        if (!$event) {
            return response()->json([
                'message' => 'Event not found.'
            ], 404);
        }
        $event->update([
            'type' => $request->type,
            'title' => $request->title,
            'date_start' => $request->date_start,
            'date_end' => $request->date_end,
            'description' => $request->description,
            'status' => $request->status,
            'time' => $request->time,
            'address' => $request->address,
        ]);

        return response()->json([
            'message' => 'Event updated successfully.',
            'event' => $event
        ]);
    }

    public function removeParticipant($participant_id)
    {
        $participant = Participant::find($participant_id);

        if (!$participant) {
            return response()->json([
                'message' => 'Participant not found.'
            ], 404);
        }

        $participant->delete();

        return response()->json([
            'message' => 'Participant removed from the event successfully.'
        ]);
    }
}

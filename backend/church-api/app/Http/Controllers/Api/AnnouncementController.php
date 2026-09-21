<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\Church;
use Illuminate\Http\Request;

class AnnouncementController extends Controller
{
    //
    public function viewAnnouncements(Request $request)
    {
        $user = $request->user();
        $church = Church::find($user->church_id);
        if (!$church) {
            return response()->json([]);
        }
        $churchIds = [$church->church_id];

        // Add parent church
        if ($church->parent_id !== null) {
            $parent = Church::find($church->parent_id);
            if ($parent) {
                $churchIds[] = $parent->church_id;
                // Add grandparent church
                if ($parent->parent_id !== null) {
                    $grandParent = Church::find($parent->parent_id);
                    if ($grandParent) {
                        $churchIds[] = $grandParent->church_id;
                    }
                }
            }
        }
        $announcements = Announcement::with(['announcedBy', 'church'])
            ->whereIn('church_id', $churchIds)
            ->orderBy('date_announced', 'desc')
            ->cursorPaginate(20); // or cursorPaginate(20) for even better performance

        return response()->json($announcements);
    }

    // public function viewAnnouncements()
    // {
    //     return response()->json(
    //         Announcement::orderBy('date_announced', 'desc')->get()
    //     );
    // }
}

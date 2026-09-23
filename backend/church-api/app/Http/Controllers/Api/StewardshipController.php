<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Particular;
use App\Models\ParticularItem;
use App\Models\Stewardship;

class StewardshipController extends Controller
{
    //
public function stewardshipParticular(Request $request)
{
    $user = $request->user();

    return response()->json([
        'user_id' => $user->user_id,
        'department_id' => $user->department_id,
        'program_id' => 6,
        'particulars' => Particular::where('program_id', 6)
            ->orderBy('particular_id')
            ->get(),
    ]);
}

public function saveMonthlyValues(Request $request)
{
    $user = $request->user();

    $validated = $request->validate([
        'particular_id' => [
            'required',
            'integer',
            'in:47,48'
        ],

        'quarter' => [
            'required',
            'in:Quarter1,Quarter2,Quarter3,Quarter4'
        ],

        'year' => [
            'required',
            'integer',
            'min:2000',
            'max:2100'
        ],

        'monthly_values' => [
            'required',
            'array'
        ],

        'monthly_values.*' => [
            'required',
            'numeric',
            'min:0'
        ],
    ]);

    // Make sure the user belongs to Stewardship Ministries
    if ((int) $user->department_id !== 2) {
        return response()->json([
            'message' => 'You are not authorized to save stewardship data.'
        ], 403);
    }

    // Make sure this particular belongs to the Stewardship program
    $particular = Particular::where('particular_id', $validated['particular_id'])
        ->where('program_id', 6)
        ->first();

    if (!$particular) {
        return response()->json([
            'message' => 'Invalid stewardship particular.'
        ], 403);
    }

    /*
    |--------------------------------------------------------------------------
    | Determine the months for the selected quarter
    |--------------------------------------------------------------------------
    */

    $monthsByQuarter = [
        'Quarter1' => ['January', 'February', 'March'],
        'Quarter2' => ['April', 'May', 'June'],
        'Quarter3' => ['July', 'August', 'September'],
        'Quarter4' => ['October', 'November', 'December'],
    ];

    $months = $monthsByQuarter[$validated['quarter']];

    /*
    |--------------------------------------------------------------------------
    | Offering / Tithes
    |--------------------------------------------------------------------------
    */

    $type = $validated['particular_id'] == 47
        ? 'Offering'
        : 'Tithes';

    /*
    |--------------------------------------------------------------------------
    | Find or create the quarterly ParticularItem
    |--------------------------------------------------------------------------
    */

    $report = ParticularItem::updateOrCreate(
        [
            'particular_id' => $validated['particular_id'],
            'quarter' => $validated['quarter'],
            'year' => $validated['year'],
            'churches_id' => $user->church_id,
        ],
        [
            'submitted_by' => $user->user_id,
            'particulars_value' => 0,
            'status' => 'submitted',
            'date_submitted' => now(),
        ]
    );

    /*
    |--------------------------------------------------------------------------
    | Save the 3 monthly values
    |--------------------------------------------------------------------------
    */

    foreach ($months as $month) {

        $value = $validated['monthly_values'][$month] ?? 0;

        Stewardship::updateOrCreate(
            [
                'par_item_id' => $report->par_item_id,
                'month' => $month,
            ],
            [
                'type' => $type,
                'value' => $value,
            ]
        );
    }

    return response()->json([
        'message' => "{$type} monthly values saved successfully.",
        'data' => $report->load('stewardships'),
    ]);
}
}

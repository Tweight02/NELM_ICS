<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\Particular;
use App\Models\ParticularItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReportController extends Controller
{
    public function getPrograms()
    {
        $user = Auth::user();
        

        $department = Department::where(
            'department_id',
            $user->department_id
        )
            ->with([
                'programs' => function ($query) {
                    $query
                        ->whereNull('parent_id')
                        ->select([
                            'program_id',
                            'department_id',
                            'program_name',
                            'parent_id'
                        ])
                        ->with([
                            'children' => function ($query) {
                                $query
                                    ->select([
                                        'program_id',
                                        'department_id',
                                        'program_name',
                                        'parent_id'
                                    ])
                                    ->with([
                                        'particulars.items'
                                    ]);
                            }
                        ]);
                }
            ])
            ->first();

        if (!$department) {
            return response()->json([
                'message' => 'Department not found'
            ], 404);
        }

        return response()->json($department);
    }

    public function saveReportValue(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'particular_id' => [
                'required',
                'integer',
                'exists:particulars,particular_id'
            ],

            'quarter' => [
                'required',
                'in:Q1,Q2,Q3,Q4'
            ],

            'year' => [
                'required',
                'integer',
                'min:2000',
                'max:2100'
            ],

            'particulars_value' => [
                'required',
                'numeric',
                'min:0'
            ],
        ]);

        $particular = Particular::where(
            'particular_id',
            $validated['particular_id']
        )
            ->whereHas('program', function ($query) use ($user) {
                $query->where(
                    'department_id',
                    $user->department_id
                );
            })
            ->first();
        if (!$particular) {
            return response()->json([
                'message' => 'You are not authorized to save this report value.'
            ], 403);
        }

        $report = ParticularItem::updateOrCreate(
            [
                'particular_id' => $validated['particular_id'],
                'quarter' => $validated['quarter'],
                'year' => $validated['year'],
                'churches_id' => $user->church_id,
            ],
            [
                'submitted_by' => $user->user_id,
                'particulars_value' => $validated['particulars_value'],
                'status' => 'submitted',
                'date_submitted' => now(),
            ]
        );

        return response()->json([
            'message' => 'Report value saved successfully.',
            'data' => $report
        ]);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Program;
use App\Models\ParticularItem;
use App\Models\User;
use Illuminate\Http\Request;

class ReportMonitoringController extends Controller
{
    /**
     * Display report monitoring for the logged-in
     * church representative head.
     */
    public function index(Request $request)
    {
        $year = $request->integer('year', now()->year);

        $user = $request->user();

        /*
        |--------------------------------------------------------------------------
        | Church
        |--------------------------------------------------------------------------
        |
        | This assumes the logged-in user has a church_id.
        | If your church_id is obtained through another relationship,
        | we can adjust this part to match your database.
        |
        */

        $churchId = $user->church_id;

        /*
        |--------------------------------------------------------------------------
        | Get programs/departments
        |--------------------------------------------------------------------------
        */

        $programs = Program::with([
            'department',
            'particulars'
        ])
        ->whereHas('department', function ($query) use ($churchId) {
            $query->where('church_id', $churchId);
        })
        ->get();

        /*
        |--------------------------------------------------------------------------
        | Group programs by department
        |--------------------------------------------------------------------------
        */

        $departments = $programs
            ->groupBy('department_id')
            ->map(function ($departmentPrograms) use ($year, $churchId) {

                $department = $departmentPrograms->first()->department;

                /*
                |--------------------------------------------------------------------------
                | Total particulars
                |--------------------------------------------------------------------------
                |
                | This is the denominator.
                |
                */

                $totalParticulars = $departmentPrograms
                    ->sum(function ($program) {
                        return $program->particulars->count();
                    });

                /*
                |--------------------------------------------------------------------------
                | Find the representative handling this department
                |--------------------------------------------------------------------------
                */

                $representative = User::where(
                    'department_id',
                    $department->department_id
                )
                ->where('role', 'church_representative')
                ->first();

                /*
                |--------------------------------------------------------------------------
                | Calculate each quarter
                |--------------------------------------------------------------------------
                */

                $quarters = [];

                foreach (['Q1', 'Q2', 'Q3', 'Q4'] as $quarter) {

                    $particularIds = $departmentPrograms
                        ->flatMap(function ($program) {
                            return $program->particulars
                                ->pluck('particular_id');
                        })
                        ->values();

                    /*
                    |--------------------------------------------------------------------------
                    | Count particulars that have a value
                    |--------------------------------------------------------------------------
                    */

                    $completedParticulars = ParticularItem::whereIn(
                        'particular_id',
                        $particularIds
                    )
                    ->where('church_id', $churchId)
                    ->where('year', $year)
                    ->where('quarter', $quarter)
                    ->whereNotNull('particulars_value')
                    ->where('particulars_value', '!=', '')
                    ->count();

                    /*
                    |--------------------------------------------------------------------------
                    | Determine whether the quarter has a report
                    |--------------------------------------------------------------------------
                    */

                    $hasReport = ParticularItem::whereIn(
                        'particular_id',
                        $particularIds
                    )
                    ->where('church_id', $churchId)
                    ->where('year', $year)
                    ->where('quarter', $quarter)
                    ->exists();

                    /*
                    |--------------------------------------------------------------------------
                    | Calculate progress
                    |--------------------------------------------------------------------------
                    */

                    $percentage = $totalParticulars > 0
                        ? round(
                            ($completedParticulars / $totalParticulars) * 100
                        )
                        : null;

                    $quarters[$quarter] = [
                        'total' => $totalParticulars,
                        'completed' => $completedParticulars,
                        'percentage' => $percentage,
                        'has_report' => $hasReport,
                    ];
                }

                return [
                    'department_id' => $department->department_id,
                    'department_name' => $department->department_name,

                    'representative' => $representative
                        ? [
                            'user_id' => $representative->user_id,
                            'name' => trim(
                                $representative->first_name .
                                ' ' .
                                $representative->last_name
                            ),
                            'email' => $representative->email,
                        ]
                        : null,

                    'total_particulars' => $totalParticulars,

                    'quarters' => $quarters,
                ];
            })
            ->values();

        return response()->json([
            'year' => $year,
            'departments' => $departments,
        ]);
    }
}
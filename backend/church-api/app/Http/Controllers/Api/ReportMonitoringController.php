<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\Program;
use App\Models\ParticularItem;
use App\Models\User;
use Illuminate\Http\Request;

class ReportMonitoringController extends Controller
{
    /**
     * Get monitoring information for all departments.
     */
    public function index(Request $request)
    {
        $year = $request->integer('year', now()->year);

        $user = $request->user();
        $churchId = $user->church_id;

        /*
        |--------------------------------------------------------------------------
        | Get church representatives
        |--------------------------------------------------------------------------
        */

        $representatives = User::where('church_id', $churchId)
            ->where('role', 'church_representative')
            ->whereNotNull('department_id')
            ->where('department_id', '!=', 4)
            ->get([
                'user_id',
                'department_id',
                'first_name',
                'last_name',
                'email',
            ])
            ->keyBy('department_id');

        $departmentIds = $representatives
            ->pluck('department_id')
            ->unique()
            ->values();

        /*
        |--------------------------------------------------------------------------
        | Get departments
        |--------------------------------------------------------------------------
        */

        $departments = Department::whereIn(
            'department_id',
            $departmentIds
        )
            ->get([
                'department_id',
                'department_name',
            ])
            ->keyBy('department_id');

        /*
        |--------------------------------------------------------------------------
        | Get programs and particulars
        |--------------------------------------------------------------------------
        */

        $programs = Program::with([
            'particulars',
        ])
            ->whereIn('department_id', $departmentIds)
            ->get([
                'program_id',
                'department_id',
                'program_name',
                'parent_id',
            ]);

        $programsByDepartment = $programs->groupBy(
            'department_id'
        );

        /*
        |--------------------------------------------------------------------------
        | Get all particular IDs
        |--------------------------------------------------------------------------
        */

        $allParticularIds = $programs
            ->flatMap(function ($program) {
                return $program->particulars
                    ->pluck('particular_id');
            })
            ->unique()
            ->values();

        /*
        |--------------------------------------------------------------------------
        | Get particular items
        |--------------------------------------------------------------------------
        |
        | IMPORTANT:
        | Your database stores quarters as:
        |
        | Q1
        | Q2
        | Q3
        | Q4
        |
        */

        $items = collect();

        if ($allParticularIds->isNotEmpty()) {

            $items = ParticularItem::where(
                'churches_id',
                $churchId
            )
                ->where('year', $year)
                ->whereIn(
                    'particular_id',
                    $allParticularIds
                )
                ->whereIn('quarter', [
                    'Q1',
                    'Q2',
                    'Q3',
                    'Q4',
                ])
                ->get([
                    'par_item_id',
                    'particular_id',
                    'quarter',
                    'particulars_value',
                ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Group items by quarter
        |--------------------------------------------------------------------------
        */

        $itemsByQuarter = [
            'Quarter1' => $items->where('quarter', 'Q1'),
            'Quarter2' => $items->where('quarter', 'Q2'),
            'Quarter3' => $items->where('quarter', 'Q3'),
            'Quarter4' => $items->where('quarter', 'Q4'),
        ];

        /*
        |--------------------------------------------------------------------------
        | Build department monitoring result
        |--------------------------------------------------------------------------
        */

        $result = $departmentIds
            ->map(function ($departmentId) use (
                $departments,
                $representatives,
                $programsByDepartment,
                $itemsByQuarter
            ) {

                $department = $departments->get(
                    $departmentId
                );

                if (!$department) {
                    return null;
                }

                $departmentPrograms = $programsByDepartment->get(
                    $departmentId,
                    collect()
                );

                /*
                |--------------------------------------------------------------------------
                | Get all particulars for this department
                |--------------------------------------------------------------------------
                */

                $particularIds = $departmentPrograms
                    ->flatMap(function ($program) {
                        return $program->particulars
                            ->pluck('particular_id');
                    })
                    ->unique()
                    ->values();

                $totalParticulars = $particularIds->count();

                /*
                |--------------------------------------------------------------------------
                | Representative
                |--------------------------------------------------------------------------
                */

                $representative = $representatives->get(
                    $departmentId
                );

                /*
                |--------------------------------------------------------------------------
                | Quarter monitoring
                |--------------------------------------------------------------------------
                */

                $quarters = [];

                foreach ([
                    'Quarter1',
                    'Quarter2',
                    'Quarter3',
                    'Quarter4',
                ] as $quarter) {

                    $quarterItems = $itemsByQuarter[$quarter]
                        ?? collect();

                    $departmentItems = $quarterItems->whereIn(
                        'particular_id',
                        $particularIds
                    );

                    /*
                    |--------------------------------------------------------------------------
                    | Count completed particulars
                    |--------------------------------------------------------------------------
                    */

                    $completedParticulars = $departmentItems
                        ->filter(function ($item) {

                            return $item->particulars_value !== null
                                && $item->particulars_value !== '';
                        })
                        ->pluck('particular_id')
                        ->unique()
                        ->count();

                    /*
                    |--------------------------------------------------------------------------
                    | Determine if report exists
                    |--------------------------------------------------------------------------
                    */

                    $hasReport = $departmentItems->isNotEmpty();

                    /*
                    |--------------------------------------------------------------------------
                    | Percentage
                    |--------------------------------------------------------------------------
                    */

                    $percentage = $totalParticulars > 0
                        ? round(
                            (
                                $completedParticulars
                                / $totalParticulars
                            ) * 100
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
                    'department_id' =>
                        $department->department_id,

                    'department_name' =>
                        $department->department_name,

                    'representative' => $representative
                        ? [
                            'user_id' =>
                                $representative->user_id,

                            'name' => trim(
                                $representative->first_name
                                . ' '
                                . $representative->last_name
                            ),

                            'email' =>
                                $representative->email,
                        ]
                        : null,

                    'total_particulars' =>
                        $totalParticulars,

                    'quarters' =>
                        $quarters,
                ];
            })
            ->filter()
            ->values();

        return response()->json([
            'year' => $year,
            'departments' => $result,
        ]);
    }


    /**
     * Get complete report for one department.
     */
    public function departmentReport(
        Request $request,
        $departmentId
    ) {

        $year = $request->integer(
            'year',
            now()->year
        );

        $user = $request->user();

        $churchId = $user->church_id;

        /*
        |--------------------------------------------------------------------------
        | Get department
        |--------------------------------------------------------------------------
        */

        $department = Department::findOrFail(
            $departmentId
        );

        /*
        |--------------------------------------------------------------------------
        | Get programs and particulars
        |--------------------------------------------------------------------------
        */

        $programs = Program::with([
            'department',
            'particulars',
        ])
            ->where(
                'department_id',
                $departmentId
            )
            ->get();

        /*
        |--------------------------------------------------------------------------
        | Get all particular IDs
        |--------------------------------------------------------------------------
        */

        $particularIds = $programs
            ->flatMap(function ($program) {

                return $program->particulars
                    ->pluck('particular_id');
            })
            ->unique()
            ->values();

        /*
        |--------------------------------------------------------------------------
        | Get report items
        |--------------------------------------------------------------------------
        |
        | Your database uses Q1/Q2/Q3/Q4.
        |
        */

        $items = ParticularItem::where(
            'churches_id',
            $churchId
        )
            ->where(
                'year',
                $year
            )
            ->whereIn(
                'particular_id',
                $particularIds
            )
            ->whereIn('quarter', [
                'Q1',
                'Q2',
                'Q3',
                'Q4',
            ])
            ->get([
                'par_item_id',
                'particular_id',
                'quarter',
                'particulars_value',
            ]);

        /*
        |--------------------------------------------------------------------------
        | Group items by particular
        |--------------------------------------------------------------------------
        */

        $itemsByParticular = $items->groupBy(
            'particular_id'
        );

        /*
        |--------------------------------------------------------------------------
        | Get representative
        |--------------------------------------------------------------------------
        */

        $representative = User::where(
            'church_id',
            $churchId
        )
            ->where(
                'department_id',
                $departmentId
            )
            ->where(
                'role',
                'church_representative'
            )
            ->first();

        /*
        |--------------------------------------------------------------------------
        | Build program response
        |--------------------------------------------------------------------------
        */

        $programData = $programs->map(
            function ($program) use (
                $itemsByParticular
            ) {

                $particularData =
                    $program->particulars->map(
                        function ($particular) use (
                            $itemsByParticular
                        ) {

                            /*
                            |--------------------------------------------------------------------------
                            | Get items for this particular
                            |--------------------------------------------------------------------------
                            */

                            $particularItems =
                                $itemsByParticular->get(
                                    $particular->particular_id,
                                    collect()
                                );

                            /*
                            |--------------------------------------------------------------------------
                            | Build quarterly values
                            |--------------------------------------------------------------------------
                            |
                            | Database:
                            |
                            | Q1 -> Quarter1
                            | Q2 -> Quarter2
                            | Q3 -> Quarter3
                            | Q4 -> Quarter4
                            |
                            */

                            $quarterMapping = [
                                'Quarter1' => 'Q1',
                                'Quarter2' => 'Q2',
                                'Quarter3' => 'Q3',
                                'Quarter4' => 'Q4',
                            ];

                            $quarters = [];

                            foreach (
                                $quarterMapping
                                as $quarterName => $databaseQuarter
                            ) {

                                $item =
                                    $particularItems->firstWhere(
                                        'quarter',
                                        $databaseQuarter
                                    );

                                $quarters[$quarterName] = [
                                    'value' => $item
                                        ? $item->particulars_value
                                        : null,
                                ];
                            }

                            /*
                            |--------------------------------------------------------------------------
                            | Monthly values
                            |--------------------------------------------------------------------------
                            |
                            | Tithes and Offering use stewardship
                            | records for monthly values.
                            |
                            */

                            $monthly = null;

                            $particularName =
                                strtolower(
                                    trim(
                                        $particular->particular_name
                                    )
                                );

                            if (
                                in_array(
                                    $particularName,
                                    [
                                        'tithes',
                                        'offering',
                                        'offerings',
                                    ],
                                    true
                                )
                            ) {

                                $monthly = [
                                    'January' => null,
                                    'February' => null,
                                    'March' => null,
                                    'April' => null,
                                    'May' => null,
                                    'June' => null,
                                    'July' => null,
                                    'August' => null,
                                    'September' => null,
                                    'October' => null,
                                    'November' => null,
                                    'December' => null,
                                ];

                                /*
                                |--------------------------------------------------------------------------
                                | Load stewardship records
                                |--------------------------------------------------------------------------
                                */

                                $particularItemsWithStewardship =
                                    ParticularItem::with(
                                        'stewardship'
                                    )
                                        ->whereIn(
                                            'par_item_id',
                                            $particularItems->pluck(
                                                'par_item_id'
                                            )
                                        )
                                        ->get();

                                $monthNames = [
                                    1 => 'January',
                                    2 => 'February',
                                    3 => 'March',
                                    4 => 'April',
                                    5 => 'May',
                                    6 => 'June',
                                    7 => 'July',
                                    8 => 'August',
                                    9 => 'September',
                                    10 => 'October',
                                    11 => 'November',
                                    12 => 'December',
                                ];

                                foreach (
                                    $particularItemsWithStewardship
                                    as $item
                                ) {

                                    foreach (
                                        $item->stewardship
                                        as $record
                                    ) {

                                        if (
                                            isset(
                                                $monthNames[
                                                    $record->month
                                                ]
                                            )
                                        ) {

                                            $monthly[
                                                $monthNames[
                                                    $record->month
                                                ]
                                            ] =
                                                (float) $record->value;
                                        }
                                    }
                                }
                            }

                            return [
                                'particular_id' =>
                                    $particular->particular_id,

                                'particular_name' =>
                                    $particular->particular_name,

                                'quarters' =>
                                    $quarters,

                                'monthly' =>
                                    $monthly,
                            ];
                        }
                    );

                return [
                    'program_id' =>
                        $program->program_id,

                    'program_name' =>
                        $program->program_name,

                    'parent_id' =>
                        $program->parent_id,

                    'particulars' =>
                        $particularData,
                ];
            }
        );

        /*
        |--------------------------------------------------------------------------
        | Return complete report
        |--------------------------------------------------------------------------
        */

        return response()->json([
            'year' => (int) $year,

            'department' => [
                'department_id' =>
                    $department->department_id,

                'department_name' =>
                    $department->department_name,
            ],

            'representative' =>
                $representative
                    ? [
                        'user_id' =>
                            $representative->user_id,

                        'name' => trim(
                            $representative->first_name
                            . ' '
                            . $representative->last_name
                        ),

                        'email' =>
                            $representative->email,
                    ]
                    : null,

            'programs' =>
                $programData,
        ]);
    }


    /**
     * Show department report.
     *
     * This uses the same logic as departmentReport()
     * so both endpoints return the same data.
     */
    public function show(
        Request $request,
        $id
    ) {

        return $this->departmentReport(
            $request,
            $id
        );
    }
}
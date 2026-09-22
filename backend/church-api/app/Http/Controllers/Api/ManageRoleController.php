<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ManageRoleController extends Controller
{
    /**
     * Get representatives and departments
     * for the head's church.
     */
    public function index(Request $request)
    {
        $head = $request->user();

        // Only the Church Representative Head can manage roles.
        if ($head->department_id != Department::CHURCH_REPRESENTATIVES) {
            return response()->json([
                'message' => 'Unauthorized.'
            ], 403);
        }

        /*
         * Get all representatives belonging
         * to the same church as the head.
         *
         * Exclude the head himself.
         */
        $representatives = User::with('department')
            ->where('church_id', $head->church_id)
            ->where('user_id', '!=', $head->user_id)
            ->get();

        /*
         * Get all departments that can be assigned.
         *
         * Department 4 is reserved for the
         * Church Representative Head.
         */
        $departments = Department::where(
            'department_id',
            '!=',
            Department::CHURCH_REPRESENTATIVES
        )
            ->orderBy('department_name')
            ->get();

        return response()->json([
            'representatives' => $representatives,
            'departments' => $departments,
        ]);
    }


    /**
     * Assign a user to a department.
     *
     * If the selected user already belongs to another department
     * in the same church, the two users will be interchanged.
     */
    public function assignUser(Request $request, $departmentId)
    {
        $head = $request->user();

        // Only the Church Representative Head can manage roles.
        if ($head->department_id != Department::CHURCH_REPRESENTATIVES) {
            return response()->json([
                'message' => 'Unauthorized.'
            ], 403);
        }

        // Validate selected user.
        $request->validate([
            'user_id' => [
                'required',
                'integer',
                'exists:users,user_id'
            ],
        ]);

        // Department 4 is reserved for the head.
        if (
            $departmentId ==
            Department::CHURCH_REPRESENTATIVES
        ) {
            return response()->json([
                'message' =>
                'The Church Representatives department is reserved for the head.'
            ], 422);
        }

        // Make sure the department exists.
        $department = Department::where(
            'department_id',
            $departmentId
        )->first();

        if (!$department) {
            return response()->json([
                'message' => 'Department not found.'
            ], 404);
        }

        // Get the selected user from the same church.
        $selectedUser = User::where(
            'user_id',
            $request->user_id
        )
            ->where(
                'church_id',
                $head->church_id
            )
            ->where(
                'user_id',
                '!=',
                $head->user_id
            )
            ->first();

        if (!$selectedUser) {
            return response()->json([
                'message' =>
                'This user is not a representative of your church.'
            ], 404);
        }

        /*
     * Find the user currently assigned to
     * the selected department.
     */
        $currentDepartmentUser = User::where(
            'church_id',
            $head->church_id
        )
            ->where(
                'department_id',
                $departmentId
            )
            ->where(
                'user_id',
                '!=',
                $head->user_id
            )
            ->first();

        /*
     * If the selected user is already assigned
     * to this exact department, nothing needs to change.
     */
        if (
            $selectedUser->department_id ==
            $departmentId
        ) {
            return response()->json([
                'message' =>
                'This user is already assigned to this department.',
                'user' => $selectedUser->load('department'),
                'department' => $department
            ]);
        }

        /*
     * If the selected user is assigned to another
     * department, swap the two users.
     */
        if (!is_null($selectedUser->department_id)) {

            $oldDepartmentId =
                $selectedUser->department_id;

            $oldDepartment = Department::where(
                'department_id',
                $oldDepartmentId
            )->first();

            DB::transaction(function () use (
                $selectedUser,
                $currentDepartmentUser,
                $departmentId,
                $oldDepartmentId
            ) {

                /*
             * Temporarily remove the selected user's
             * department to avoid duplicate assignment
             * conflicts.
             */
                $selectedUser->department_id = null;
                $selectedUser->save();

                /*
             * If the target department already has
             * another user, move that user to the
             * selected user's old department.
             */
                if ($currentDepartmentUser) {
                    $currentDepartmentUser->department_id =
                        $oldDepartmentId;

                    $currentDepartmentUser->save();
                }

                /*
             * Finally assign the selected user
             * to the target department.
             */
                $selectedUser->department_id =
                    $departmentId;

                $selectedUser->save();
            });

            $selectedUser->load('department');

            if ($currentDepartmentUser) {
                $currentDepartmentUser->load('department');
            }

            return response()->json([
                'message' =>
                'Users exchanged successfully.',

                'user' =>
                $selectedUser,

                'department' =>
                $department,

                'previous_user' =>
                $currentDepartmentUser
            ]);
        }

        /*
     * The selected user currently has no department.
     *
     * Make sure the target department does not
     * already have a user.
     */
        if ($currentDepartmentUser) {
            return response()->json([
                'message' =>
                'This department is already assigned to another user.'
            ], 422);
        }

        /*
     * Assign the unassigned user.
     */
        $selectedUser->department_id =
            $departmentId;

        $selectedUser->save();

        $selectedUser->load('department');

        return response()->json([
            'message' =>
            'User assigned to department successfully.',

            'user' =>
            $selectedUser,

            'department' =>
            $department,

            'previous_user' =>
            null
        ]);
    }

    /**
     * Add a new church user.
     */
    public function createUser(Request $request)
    {
        $head = $request->user();

        /*
         * Only the Church Representatives head
         * can add users.
         */
        if (
            $head->department_id !=
            Department::CHURCH_REPRESENTATIVES
        ) {
            return response()->json([
                'message' => 'Unauthorized.'
            ], 403);
        }

        $validated = $request->validate([
            'department_id' => [
                'required',
                'integer',
                'exists:departments,department_id'
            ],

            'first_name' => [
                'required',
                'string',
                'max:100'
            ],

            'middle_name' => [
                'nullable',
                'string',
                'max:100'
            ],

            'last_name' => [
                'required',
                'string',
                'max:100'
            ],

            'extension_name' => [
                'nullable',
                'string',
                'max:20'
            ],

            'birthdate' => [
                'required',
                'date'
            ],

            'gender' => [
                'required',
                'string',
                'max:20'
            ],

            'email' => [
                'required',
                'email',
                'max:255',
                'unique:users,email'
            ],

            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed'
            ],
        ]);

        /*
         * Department 4 belongs exclusively
         * to the Church Representatives head.
         */
        if (
            $validated['department_id'] ==
            Department::CHURCH_REPRESENTATIVES
        ) {
            return response()->json([
                'message' =>
                    'The Church Representatives department is reserved for the head.'
            ], 422);
        }

        /*
         * Prevent two users from being assigned
         * to the same department.
         */
        $departmentAlreadyAssigned = User::where(
            'church_id',
            $head->church_id
        )
            ->where(
                'department_id',
                $validated['department_id']
            )
            ->exists();

        if ($departmentAlreadyAssigned) {
            return response()->json([
                'message' =>
                    'This department already has an assigned user. Use the department assignment list to exchange users.'
            ], 422);
        }

        /*
         * Automatically assign the new user
         * to the same church as the head.
         */
        $user = User::create([
            'department_id' =>
                $validated['department_id'],

            'church_id' =>
                $head->church_id,

            'first_name' =>
                $validated['first_name'],

            'middle_name' =>
                $validated['middle_name'] ?? null,

            'last_name' =>
                $validated['last_name'],

            'extension_name' =>
                $validated['extension_name'] ?? null,

            'birthdate' =>
                $validated['birthdate'],

            'gender' =>
                $validated['gender'],

            'role' =>
                'church_representative',

            'email' =>
                $validated['email'],

            'password' =>
                $validated['password'],
        ]);

        $user->load('department');

        return response()->json([
            'message' =>
                'Church representative added successfully.',

            'user' =>
                $user
        ], 201);
    }
}

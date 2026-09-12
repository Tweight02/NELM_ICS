<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $users = [
            [
                'department_id'  => 3,
                'church_id'      => 2,
                'first_name'     => 'Juan',
                'middle_name'    => 'Reyes',
                'last_name'      => 'Dela Cruz',
                'extension_name' => null,
                'birthdate'      => '1975-03-14',
                'gender'         => 'male',
                'email'          => 'pastor@example.com',
                'role'           => 'pastor',
            ],
            [
                'department_id'  => 3,
                'church_id'      => 1,
                'first_name'     => 'Maria',
                'middle_name'    => 'Lopez',
                'last_name'      => 'Santos',
                'extension_name' => null,
                'birthdate'      => '1988-07-22',
                'gender'         => 'female',
                'email'          => 'secretary@example.com',
                'role'           => 'secretary',
            ],
            [
                'department_id'  => 3,
                'church_id'      => 1,
                'first_name'     => 'Daniel',
                'middle_name'    => 'Garcia',
                'last_name'      => 'Ramos',
                'extension_name' => null,
                'birthdate'      => '1982-11-05',
                'gender'         => 'male',
                'email'          => 'director@example.com',
                'role'           => 'director',
            ],
            [
                'department_id'  => 3,
                'church_id'      => 3,
                'first_name'     => 'Jose',
                'middle_name'    => 'Torres',
                'last_name'      => 'Mendoza',
                'extension_name' => 'Jr.',
                'birthdate'      => '1990-01-30',
                'gender'         => 'male',
                'email'          => 'representative@example.com',
                'role'           => 'church_representative',
            ],
            [
                'department_id'  => 4,
                'church_id'      => 3,
                'first_name'     => 'Michelle',
                'middle_name'    => 'Jane',
                'last_name'      => 'Doe',
                'extension_name' => null,
                'birthdate'      => '1979-09-18',
                'gender'         => 'female',
                'email'          => 'representative2@example.com',
                'role'           => 'church_representative',
            ],
        ];

        foreach ($users as $user) {
            User::create([
                'department_id'  => $user['department_id'],
                'church_id'      => $user['church_id'],
                'first_name'     => $user['first_name'],
                'middle_name'    => $user['middle_name'],
                'last_name'      => $user['last_name'],
                'extension_name' => $user['extension_name'],
                'birthdate'      => $user['birthdate'],
                'gender'         => $user['gender'],
                'role'           => $user['role'],
                'email'          => $user['email'],
                'password'       => Hash::make('pass123'),
            ]);
        }
    }
}
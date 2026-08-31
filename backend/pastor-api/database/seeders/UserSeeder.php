<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $users = [
                [
                    'name' => 'Juan Dela Cruz',
                    'email' => 'pastor@example.com',
                    'role' => 'pastor',
                ],
                [
                    'name' => 'Maria Santos',
                    'email' => 'secretary@example.com',
                    'role' => 'secretary',
                ],
                [
                    'name' => 'Daniel Ramos',
                    'email' => 'director@example.com',
                    'role' => 'director',
                ],
                [
                    'name' => 'Jose Mendoza',
                    'email' => 'representative@example.com',
                    'role' => 'church_representative',
                ],
                [
                    'name' => 'John Doe',
                    'email' => 'pastor2@example.com',
                    'role' => 'pastor',
                ],
        ];
        foreach ($users as $user) {
            User::create(['name' => $user['name'], 'email' => $user['email'], 'role' => $user['role'], 'password' => Hash::make('123'),]);
        }
    }
}

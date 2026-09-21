<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ParticipantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('participants')->insert([
            [
                'event_id' => 5,
                'church_id' => 3,
                'registration_status' => 'Registered',
                'first_name' => 'Juan',
                'middle_name' => 'Santos',
                'last_name' => 'Dela Cruz',
                'extension_name' => null,
                'birthdate' => '2000-05-15',
                'age' => 26,
                'gender' => 'Male',
            ],
            [
                'event_id' => 5,
                'church_id' => 3,
                'registration_status' => 'Registered',
                'first_name' => 'Maria',
                'middle_name' => 'Garcia',
                'last_name' => 'Reyes',
                'extension_name' => null,
                'birthdate' => '1998-08-22',
                'age' => 28,
                'gender' => 'Female',
            ],
            [
                'event_id' => 5,
                'church_id' => 3,
                'registration_status' => 'Pending',
                'first_name' => 'Mark',
                'middle_name' => 'Anthony',
                'last_name' => 'Villanueva',
                'extension_name' => 'Jr.',
                'birthdate' => '2002-02-10',
                'age' => 24,
                'gender' => 'Male',
            ],
            [
                'event_id' => 5,
                'church_id' => 3,
                'registration_status' => 'Registered',
                'first_name' => 'Angela',
                'middle_name' => 'Marie',
                'last_name' => 'Mendoza',
                'extension_name' => null,
                'birthdate' => '2001-11-03',
                'age' => 24,
                'gender' => 'Female',
            ],
            [
                'event_id' => 5,
                'church_id' => 3,
                'registration_status' => 'Pending',
                'first_name' => 'Daniel',
                'middle_name' => 'Jose',
                'last_name' => 'Bautista',
                'extension_name' => null,
                'birthdate' => '1995-07-18',
                'age' => 31,
                'gender' => 'Male',
            ],
            [
                'event_id' => 5,
                'church_id' => 3,
                'registration_status' => 'Registered',
                'first_name' => 'Sophia',
                'middle_name' => 'Anne',
                'last_name' => 'Navarro',
                'extension_name' => null,
                'birthdate' => '2003-04-27',
                'age' => 23,
                'gender' => 'Female',
            ],
            [
                'event_id' => 5,
                'church_id' => 3,
                'registration_status' => 'Registered',
                'first_name' => 'Carlos',
                'middle_name' => 'Miguel',
                'last_name' => 'Ramos',
                'extension_name' => 'III',
                'birthdate' => '1992-09-12',
                'age' => 34,
                'gender' => 'Male',
            ],
            [
                'event_id' => 5,
                'church_id' => 3,
                'registration_status' => 'Pending',
                'first_name' => 'Patricia',
                'middle_name' => 'Louise',
                'last_name' => 'Torres',
                'extension_name' => null,
                'birthdate' => '1999-12-01',
                'age' => 26,
                'gender' => 'Female',
            ],
        ]);
    }
}
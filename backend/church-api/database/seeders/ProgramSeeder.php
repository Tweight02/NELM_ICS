<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Program;

class ProgramSeeder extends Seeder
{
    public function run(): void
    {
        $programs = [
            'No. of Sabbath Schools',
            'Sabbath School Membership',
            'Personal Ministries',
            'Bible Correspondence School - VOP',
        ];

        Program::create([
            'department_id' => 3,
            'program_name' => 'Sabbath School & Personal Ministries',
            'parent_id' => null,
        ]);

        foreach ($programs as $program) {
            Program::create([
                'department_id' => 3,
                'program_name' => $program,
                'parent_id' => 1,
            ]);
        }
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Particular;

class ParticularSeeder extends Seeder
{
    public function run(): void
    {
        $particulars = [
            // Sabbath School Membership - program_id 2
            [
                'program_id' => 2,
                'particular_name' => 'Cradle Roll (0-4 years old)',
            ],
            [
                'program_id' => 2,
                'particular_name' => 'Kindergarten (5-6)',
            ],
            [
                'program_id' => 2,
                'particular_name' => 'Primary (7-9)',
            ],
            [
                'program_id' => 2,
                'particular_name' => 'Junior (10-13)',
            ],
            [
                'program_id' => 2,
                'particular_name' => 'Earliteens (13-15)',
            ],
            [
                'program_id' => 2,
                'particular_name' => 'Youth (16-35)',
            ],
            [
                'program_id' => 2,
                'particular_name' => 'Adult (35 and above)',
            ],
            [
                'program_id' => 2,
                'particular_name' => 'Extension Division',
            ],
            [
                'program_id' => 2,
                'particular_name' => 'Total SS Membership',
            ],
            [
                'program_id' => 2,
                'particular_name' => 'Vacation Bible School Enrollment',
            ],
            [
                'program_id' => 2,
                'particular_name' => 'Sabbath School Teachers-Certified',
            ],

            // Personal Ministries - program_id 3
            [
                'program_id' => 3,
                'particular_name' => 'No of members Trained this quarter',
            ],
            [
                'program_id' => 3,
                'particular_name' => 'No. of Members actively Involved in Evangelism',
            ],
            [
                'program_id' => 3,
                'particular_name' => 'No. of Churches that participated in evangelism',
            ],
            [
                'program_id' => 3,
                'particular_name' => 'lay evangelism & Seminars conducted',
            ],
            [
                'program_id' => 3,
                'particular_name' => 'Lay Bible Studies',
            ],
            [
                'program_id' => 3,
                'particular_name' => "Baptisms resulting from laymen, pastors, LE's",
            ],
            [
                'program_id' => 3,
                'particular_name' => 'Pieces of Literature distributed',
            ],
            [
                'program_id' => 3,
                'particular_name' => 'Community Service Unit',
            ],
            [
                'program_id' => 3,
                'particular_name' => 'ASI Chapters',
            ],

            // Bible Correspondence School - VOP - program_id 4
            [
                'program_id' => 4,
                'particular_name' => 'Enrollment',
            ],
            [
                'program_id' => 4,
                'particular_name' => 'Graduates',
            ],
            [
                'program_id' => 4,
                'particular_name' => 'Baptisms',
            ],
            [
                'program_id' => 4,
                'particular_name' => 'Number of ACS Chapters',
            ],
            [
                'program_id' => 4,
                'particular_name' => 'Number of CARE Groups',
            ],
            [
                'program_id' => 4,
                'particular_name' => 'Number of CARE group Members',
            ],
            [
                'program_id' => 4,
                'particular_name' => 'Number of Churches with CARE Groups',
            ],
        ];

        foreach ($particulars as $particular) {
            Particular::create($particular);
        }
    }
}
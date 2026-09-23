<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StewardshipSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $programId = 6;

        $particulars = [
            'No. of Church Members',
            'No. of STW Seminar conducted',
            'No. of STW Promotion conducted',
            'No. of Families visited & given STW awareness program',
            'No. of Certification conducted on Basic STW Educator',
            'No. of Pastors/Local church leaders as STW educator',
            'No. of STW sermons preached on Biblical Stewardship',
            'No. of Tithe Giving Units',
            '% of members returning Tithe',
            'No. of church members practicing Combine Offering Plan',
            'Number of members participating in regular giving',
            'Number of notable challenges or success stories',
            'Offering',
            'Tithes',
        ];

        $rows = array_map(fn ($name) => [
            'program_id'      => $programId,
            'particular_name' => $name,
        ], $particulars);

        DB::table('particulars')->insert($rows);
    }
}
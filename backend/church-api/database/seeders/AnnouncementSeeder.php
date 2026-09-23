<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AnnouncementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        DB::table('announcements')->insert([
            [
                'announce_by' => 1,
                'church_id' => 3,
                'details' => 'Church worship service will be held this Sunday at 9:00 AM. All members are encouraged to attend.',
                'date_announced' => now()->toDateString(),
            ],
            [
                'announce_by' => 1,
                'church_id' => 3,
                'details' => 'Monthly church meeting will be held after the worship service. Please be present and participate.',
                'date_announced' => now()->subDays(2)->toDateString(),
            ],
            [
                'announce_by' => 1,
                'church_id' => 3,
                'details' => 'The church will conduct a community outreach activity this Saturday. Volunteers are welcome to join.',
                'date_announced' => now()->subDays(5)->toDateString(),
            ],
            [
                'announce_by' => 1,
                'church_id' => 3,
                'details' => 'Please submit all department reports before the end of the month for proper consolidation.',
                'date_announced' => now()->subDays(7)->toDateString(),
            ],
        ]);
    }
}

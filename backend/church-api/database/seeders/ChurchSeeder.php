<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Church;

class ChurchSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
// Parent / main churches first (parent_id is null)
        $mainChurch = Church::create([
            'name'      => 'Northeast Luzon Mission',
            'address'   => '',
            'parent_id' => null,
        ]);

        $branch1 = Church::create([
            'name'      => 'Metro Tuguegarao',
            'address'   => '',
            'parent_id' => 1,
        ]);

        // Sub-congregations referencing a parent church
        Church::create([
            'name'      => 'Tuguegarao Central',
            'address'   => 'Sharon Village, Tuguegarao City',
            'parent_id' => 2,
        ]);

        Church::create([
            'name'      => 'Libag Company',
            'address'   => 'Capatan, Libag, Tuguegarao',
            'parent_id' => 2,
        ]);

        Church::create([
            'name'      => 'Cabbo Company',
            'address'   => 'Cabbo, Peñablanca, Cagayan',
            'parent_id' => 2,
        ]);

        Church::create([
            'name'      => 'Nannarian',
            'address'   => 'Nannarian, Peñablanca, Cagayan',
            'parent_id' => 2,
        ]);
    }
}

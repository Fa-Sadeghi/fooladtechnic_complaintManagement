<?php

namespace Database\Seeders;

use App\Models\DissatisfactionReason;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DissatisfactionReasonSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $reasons = [
            'نارضایتی 1',
            'نارضایتی 2',
            'نارضایتی 3',
            'نارضایتی 4',
            'نارضایتی 5',
        ];

        foreach ($reasons as $index => $title) {
            DissatisfactionReason::updateOrCreate(
                ['title' => $title],
                [
                    'is_active' => true,
                    'sort_order' => $index + 1,
                ]
            );
        }
    }
}

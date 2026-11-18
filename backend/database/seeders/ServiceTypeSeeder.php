<?php

namespace Database\Seeders;

use App\Models\ServiceType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ServiceTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $serviceTypes = [
            'سرویس 1',
            'سرویس 2',
            'سرویس 3',
            'سرویس 4',
            'سرویس 5',
        ];

        foreach ($serviceTypes as $index => $title) {
            ServiceType::updateOrCreate(
                ['title' => $title],
                [
                    'is_active' => true,
                    'sort_order' => $index + 1,
                ]
            );
        }
    }
}

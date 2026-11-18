<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('complaints', function (Blueprint $table) {
            $table->id();
            $table->string('full_name', 150);
            $table->string('organization_name', 200);
            $table->string('email', 150)->nullable();
            $table->string('mobile', 20);
            $table->string('landline', 20)->nullable();
            $table->string('project_title', 200);
            $table->foreignId('service_type_id')
                ->constrained('service_types')
                ->restrictOnDelete();
            $table->foreignId('dissatisfaction_reason_id')
                ->constrained('dissatisfaction_reasons')
                ->restrictOnDelete();
            $table->text('description');
            $table->text('proposed_solution')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->index('full_name');
            $table->index('organization_name');
            $table->index('project_title');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('complaints');
    }
};

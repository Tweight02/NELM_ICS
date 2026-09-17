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
        Schema::create('participants', function (Blueprint $table) {
            $table->id('participant_id');
            $table->foreignId('event_id')
                ->constrained('events', 'event_id')
                ->cascadeOnDelete();
            $table->foreignId('church_id')
                ->constrained('churches', 'church_id')
                ->cascadeOnDelete();
            $table->string('registration_status');
            $table->string('first_name');
            $table->string('middle_name');
            $table->string('last_name');
            $table->string('extension_name')->nullable();
            $table->date('birthdate');
            $table->integer('age');
            $table->string('gender');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('participants');
    }
};

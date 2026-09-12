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
        Schema::create('baptisms', function (Blueprint $table) {
            $table->id('baptism_id');
            $table->foreignId('churches_id')
                ->constrained('churches', 'church_id')
                ->cascadeOnDelete();
            $table->string('first_name');
            $table->string('middle_name');
            $table->string('last_name');
            $table->string('extension_name')->nullable();
            $table->date('birthdate');
            $table->string('gender');
            $table->string('address');
            $table->string('church');
            $table->string('officiating_minister');
            $table->string('place_of_baptism');
            $table->date('date_of_baptism');
            $table->integer('age');
            $table->string('marital');
            $table->boolean('is_reclaimed');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('baptisms');
    }
};

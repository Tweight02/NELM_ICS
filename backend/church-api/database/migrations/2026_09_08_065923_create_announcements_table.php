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
        Schema::create('announcements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('announce_by')
                ->constrained('users', 'user_id')
                ->cascadeOnDelete();
            $table->foreignId('church_id')
                ->constrained('churches', 'church_id')
                ->cascadeOnDelete();
            $table->string('details');
            $table->date('date_announced');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('announcements');
    }
};

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
        Schema::create('particular_items', function (Blueprint $table) {
            $table->id('par_item_id');
            $table->foreignId('particular_id')
                ->constrained('particulars', 'particular_id')
                ->cascadeOnDelete();
            $table->foreignId('approved_by')
                ->constrained('users', 'user_id')
                ->cascadeOnDelete();
            $table->foreignId('endorsed_by')
                ->constrained('users', 'user_id')
                ->cascadeOnDelete();
            $table->foreignId('submitted_by')
                ->constrained('users', 'user_id')
                ->cascadeOnDelete();
            $table->foreignId('churches_id')
                ->constrained('churches', 'church_id')
                ->cascadeOnDelete();
            $table->string('quarter');
            $table->string('year');
            $table->date('date_submitted');
            $table->date('date_approved');
            $table->string('particulars_value');
            $table->string('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('particular_items');
    }
};

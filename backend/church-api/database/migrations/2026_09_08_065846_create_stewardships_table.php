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
        Schema::create('stewardships', function (Blueprint $table) {
            $table->id('stewardship_id');
            $table->foreignId('par_item_id')
                ->constrained('particular_items', 'par_item_id')
                ->cascadeOnDelete();
            $table->string('type');
            $table->string('month');
            $table->string('value');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stewardships');
    }
};

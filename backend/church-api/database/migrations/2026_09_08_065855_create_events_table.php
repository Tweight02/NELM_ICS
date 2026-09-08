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
        Schema::create('events', function (Blueprint $table) {
            $table->id('event_id');
            $table->foreignId('par_item_id')
                ->constrained('particular_items', 'par_item_id')
                ->cascadeOnDelete();
            $table->string('type');
            $table->string('title');
            $table->date('date_start');
            $table->date('date_end');
            $table->string('description');
            $table->string('status');
            $table->time('time');
            $table->string('address');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};

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
            $table->foreignId('particular_id');
            $table->foreignId('endorsed_by')->nullable();
            $table->foreignId('approved_by')->nullable();
            $table->foreignId('submitted_by');
            $table->foreignId('church_id');
            $table->string('quarter');
            $table->string('year');
            $table->date('date_submitted');
            $table->date('date_approved');
            $table->int('particular_value');
            $table->string('status', 20);
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

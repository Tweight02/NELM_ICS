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
        Schema::create('users', function (Blueprint $table) {
            $table->id('user_id');
            $table->foreignId('department_id');
            $table->foreignId('church_id');
            $table->string('first_name',45);
            $table->string('middle_name',45);
            $table->string('last_name',45);
            $table->string('extension_name',45)->nullable();
            $table->string('birthdate',45);
            $table->string('gender');
            $table->string('role');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('password_reset', function (Blueprint $table) {
            $table->id();
            $table->integer('user_id');
            $table->string('phone')->default(null);
            $table->string('email')->default(null);
            $table->string('device')->default(null);
            $table->string('ip_address')->default(null);
            $table->string('code')->default(null);
            $table->integer('is_code_valid')->default(null);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('password_reset');
    }
};

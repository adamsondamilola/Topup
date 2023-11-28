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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->string('phone');
            $table->string('first_name');
            $table->string('last_name');
            $table->string('package');
            $table->float('package_amount');
            $table->string('username');
            $table->string('password', 255);
            $table->string('pin', 255);
            $table->string('referral'); //->nullable()->change;
            $table->string('device_info');
            $table->string('ip_address');
            $table->string('country');
            $table->enum('role', ['User', 'Admin', 'Vendor'])->default('User');
            $table->integer('status')->default(1);
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
        Schema::dropIfExists('users');
    }
};

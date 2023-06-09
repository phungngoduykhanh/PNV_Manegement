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
            $table->string('username')->unique();
            $table->string('password');
            $table->string('name');
            $table->string('background_img')->nullable();
            $table->string('img')->default('https://bloghomestay.vn/wp-content/uploads/2023/01/top-100-anh-gai-xinh-tik-tok-cute-dang-yeu-thoi-thuong-cuc-hot_6.jpg');
            $table->string('email')->unique();
            $table->integer('phone')->nullable();
            $table->string('address')->nullable();
            $table->string('status')->default('active');
            $table->string('role')->default('student');

            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
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

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('progress', function (Blueprint $table) {
            $table->unsignedBigInteger('course_id')->after('user_id')->nullable();
            $table->enum('status', ['in_progress', 'completed'])->default('in_progress')->after('lesson_id');
            $table->timestamp('last_accessed_at')->nullable()->after('completed_at');

            $table->foreign('course_id')->references('id')->on('courses')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::table('progress', function (Blueprint $table) {
            $table->dropColumn(['course_id', 'status', 'last_accessed_at']);
        });
    }

};
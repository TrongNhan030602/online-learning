<?php use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('training_programs', function (Blueprint $table) {
            // Bước 1: Xoá FOREIGN KEY trước
            $table->dropForeign('training_programs_course_id_foreign');
        });

        Schema::table('training_programs', function (Blueprint $table) {
            // Bước 2: Xoá UNIQUE INDEX
            $table->dropUnique('training_programs_course_id_unique');
        });

        Schema::table('training_programs', function (Blueprint $table) {
            // Bước 3: Thêm lại FOREIGN KEY (không UNIQUE nữa)
            $table->foreign('course_id')
                ->references('id')
                ->on('courses')
                ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::table('training_programs', function (Blueprint $table) {
            $table->dropForeign(['course_id']);
            $table->unique('course_id');
            $table->foreign('course_id')
                ->references('id')->on('courses')
                ->onDelete('cascade');
        });
    }
};
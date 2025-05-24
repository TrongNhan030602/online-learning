<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('learning_results', function (Blueprint $table) {
            $table->float('gpa')->nullable()->after('average_score');
        });
    }

    public function down(): void
    {
        Schema::table('learning_results', function (Blueprint $table) {
            $table->dropColumn('gpa');
        });
    }
};
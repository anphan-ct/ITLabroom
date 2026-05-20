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
        Schema::table('schedules', function (Blueprint $table) {
            // Xóa cột tiết bắt đầu/kết thúc vì lịch học đã lấy thời gian qua shift_id.
            $table->dropColumn(['lesson_start', 'lesson_end']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('schedules', function (Blueprint $table) {
            $table->unsignedInteger('lesson_start')->nullable()->after('week_number');
            $table->unsignedInteger('lesson_end')->nullable()->after('lesson_start');
        });
    }
};

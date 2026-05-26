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
        if (! Schema::hasColumn('computers', 'qr_token')) {
            Schema::table('computers', function (Blueprint $table) {
                // Token QR dùng để định danh máy khi sinh viên quét điểm danh.
                $table->string('qr_token')->nullable()->unique()->after('computer_name');
            });
        }

        if (! Schema::hasColumn('attendance', 'computer_id')) {
            Schema::table('attendance', function (Blueprint $table) {
                // Lưu máy tính sinh viên đã quét QR trong buổi học.
                $table->foreignId('computer_id')
                    ->nullable()
                    ->after('student_id')
                    ->constrained('computers')
                    ->nullOnDelete()
                    ->cascadeOnUpdate();

                $table->unique(['schedule_id', 'computer_id'], 'attendance_schedule_computer_unique');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('attendance', 'computer_id')) {
            Schema::table('attendance', function (Blueprint $table) {
                $table->dropUnique('attendance_schedule_computer_unique');
                $table->dropConstrainedForeignId('computer_id');
            });
        }

        if (Schema::hasColumn('computers', 'qr_token')) {
            Schema::table('computers', function (Blueprint $table) {
                $table->dropUnique('computers_qr_token_unique');
                $table->dropColumn('qr_token');
            });
        }
    }
};

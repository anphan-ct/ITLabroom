<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasColumn('students', 'role')) {
            DB::table('students')
                ->where('role', 'class_monitor')
                ->orWhere('role', '1')
                ->update(['role' => '1']);

            DB::table('students')
                ->where('role', '<>', '1')
                ->update(['role' => '0']);

            DB::statement("
                ALTER TABLE students
                MODIFY role TINYINT UNSIGNED NOT NULL DEFAULT 0
                COMMENT '0: Sinh viên, 1: Lớp trưởng'
            ");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('students', 'role')) {
            DB::statement("
                ALTER TABLE students
                MODIFY role VARCHAR(255) NOT NULL DEFAULT 'student'
                COMMENT 'student: Sinh viên, class_monitor: Lớp trưởng'
            ");

            DB::table('students')
                ->where('role', '1')
                ->update(['role' => 'class_monitor']);

            DB::table('students')
                ->where('role', '<>', 'class_monitor')
                ->update(['role' => 'student']);
        }
    }
};

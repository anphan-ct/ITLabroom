<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (! Schema::hasColumn('students', 'role')) {
            Schema::table('students', function (Blueprint $table) {
                $table->unsignedTinyInteger('role')
                    ->default(0)
                    ->after('student_code')
                    ->comment('0: Sinh viên, 1: Lớp trưởng');
            });
        }

        DB::table('students')
            ->join('users', 'users.id', '=', 'students.user_id')
            ->join('roles', 'roles.id', '=', 'users.role_id')
            ->where('roles.role_name', 'class_monitor')
            ->update(['students.role' => 1]);

        $studentRoleId = DB::table('roles')->where('role_name', 'student')->value('id');

        if ($studentRoleId) {
            DB::table('users')
                ->join('roles', 'roles.id', '=', 'users.role_id')
                ->where('roles.role_name', 'class_monitor')
                ->update(['users.role_id' => $studentRoleId]);
        }

        DB::table('roles')->where('role_name', 'class_monitor')->delete();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('roles')->updateOrInsert(
            ['role_name' => 'class_monitor'],
            [
                'description' => 'Lớp trưởng',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        if (Schema::hasColumn('students', 'role')) {
            Schema::table('students', function (Blueprint $table) {
                $table->dropColumn('role');
            });
        }
    }
};

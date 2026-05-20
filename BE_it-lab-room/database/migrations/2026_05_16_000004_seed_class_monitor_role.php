<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Không dùng role hệ thống riêng cho lớp trưởng.
        // Chức vụ lớp trưởng được lưu tại students.role.
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};

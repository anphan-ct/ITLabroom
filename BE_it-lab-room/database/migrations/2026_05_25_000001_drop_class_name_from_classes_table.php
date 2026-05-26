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
        if (! Schema::hasColumn('classes', 'class_name')) {
            return;
        }

        Schema::table('classes', function (Blueprint $table) {
            // Bỏ tên lớp, hệ thống chỉ còn dùng mã lớp để định danh lớp học.
            $table->dropColumn('class_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('classes', 'class_name')) {
            return;
        }

        Schema::table('classes', function (Blueprint $table) {
            $table->string('class_name')->nullable()->after('class_code');
        });
    }
};

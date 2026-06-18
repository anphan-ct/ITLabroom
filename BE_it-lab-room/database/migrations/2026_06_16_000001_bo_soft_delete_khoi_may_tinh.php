<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Bỏ xóa mềm khỏi bảng máy tính vì chức năng xóa hiện dùng xóa cứng.
     */
    public function up(): void
    {
        Schema::table('may_tinh', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
    }

    /**
     * Thêm lại cột deleted_at nếu cần rollback về cơ chế xóa mềm.
     */
    public function down(): void
    {
        Schema::table('may_tinh', function (Blueprint $table) {
            $table->softDeletes();
        });
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Thêm phòng ban công tác mặc định cho giảng viên.
     */
    public function up(): void
    {
        Schema::table('giang_vien', function (Blueprint $table) {
            $table->foreignId('ma_phong_ban')
                ->nullable()
                ->after('ma_giang_vien')
                ->constrained('phong_ban')
                ->nullOnDelete();
        });
    }

    /**
     * Rollback cột phòng ban của giảng viên.
     */
    public function down(): void
    {
        Schema::table('giang_vien', function (Blueprint $table) {
            $table->dropConstrainedForeignId('ma_phong_ban');
        });
    }
};

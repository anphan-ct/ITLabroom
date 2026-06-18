<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Các bảng còn dùng deleted_at trước khi chuyển toàn hệ thống sang xóa cứng.
     */
    private array $tables = [
        'nguoi_dung',
        'giang_vien',
        'lop_hoc',
        'sinh_vien',
        'phong_ban',
        'phong_may',
        'mon_hoc',
        'phieu_nhap_may',
        'thiet_bi',
        'lop_hoc_phan',
        'phieu_tra_may',
    ];

    public function up(): void
    {
        foreach ($this->tables as $tableName) {
            if (! Schema::hasColumn($tableName, 'deleted_at')) {
                continue;
            }

            Schema::table($tableName, function (Blueprint $table) {
                $table->dropSoftDeletes();
            });
        }
    }

    public function down(): void
    {
        foreach ($this->tables as $tableName) {
            if (Schema::hasColumn($tableName, 'deleted_at')) {
                continue;
            }

            Schema::table($tableName, function (Blueprint $table) {
                $table->softDeletes();
            });
        }
    }
};

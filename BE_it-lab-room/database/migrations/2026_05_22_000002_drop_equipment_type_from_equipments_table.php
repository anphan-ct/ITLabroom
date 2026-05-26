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
        if (! Schema::hasColumn('equipments', 'equipment_type')) {
            return;
        }

        // Bỏ loại thiết bị vì tên thiết bị đã đủ mô tả theo nghiệp vụ hiện tại.
        Schema::table('equipments', function (Blueprint $table) {
            $table->dropColumn('equipment_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('equipments', 'equipment_type')) {
            return;
        }

        Schema::table('equipments', function (Blueprint $table) {
            $table->string('equipment_type')->after('equipment_name');
        });
    }
};

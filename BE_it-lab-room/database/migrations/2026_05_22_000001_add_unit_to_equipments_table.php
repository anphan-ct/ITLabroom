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
        if (Schema::hasColumn('equipments', 'unit')) {
            return;
        }

        // Thêm đơn vị tính cho thiết bị, ví dụ: Cái, Bộ, Chiếc.
        Schema::table('equipments', function (Blueprint $table) {
            $table->string('unit', 50)->default('Cái')->after('quantity');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (! Schema::hasColumn('equipments', 'unit')) {
            return;
        }

        Schema::table('equipments', function (Blueprint $table) {
            $table->dropColumn('unit');
        });
    }
};

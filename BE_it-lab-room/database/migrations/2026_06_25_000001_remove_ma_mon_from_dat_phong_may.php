<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('dat_phong_may', function (Blueprint $table) {
            $table->dropConstrainedForeignId('ma_mon');
        });
    }

    public function down(): void
    {
        Schema::table('dat_phong_may', function (Blueprint $table) {
            $table->foreignId('ma_mon')
                ->nullable()
                ->after('ma_phong')
                ->constrained('mon_hoc')
                ->nullOnDelete();
        });
    }
};

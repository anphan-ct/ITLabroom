<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('dat_phong_may', function (Blueprint $table) {
            $table->dropConstrainedForeignId('ma_tuan');
            $table->dropConstrainedForeignId('ma_nam_hoc');
        });
    }

    public function down(): void
    {
        Schema::table('dat_phong_may', function (Blueprint $table) {
            $table->foreignId('ma_nam_hoc')
                ->nullable()
                ->after('ma_mon')
                ->constrained('nam_hoc')
                ->nullOnDelete();

            $table->foreignId('ma_tuan')
                ->nullable()
                ->after('ma_nam_hoc')
                ->constrained('tuan')
                ->nullOnDelete();
        });
    }
};

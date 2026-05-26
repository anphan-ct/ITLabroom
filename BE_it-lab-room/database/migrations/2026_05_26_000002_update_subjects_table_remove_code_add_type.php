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
        Schema::table('subjects', function (Blueprint $table) {
            if (! Schema::hasColumn('subjects', 'subject_type')) {
                // Loại môn dùng theo bảng chương trình: LT là lý thuyết, TH là thực hành.
                $table->enum('subject_type', ['LT', 'TH'])->default('LT')->after('subject_name');
            }
        });

        if (Schema::hasColumn('subjects', 'subject_code')) {
            Schema::table('subjects', function (Blueprint $table) {
                $table->dropUnique('subjects_subject_code_unique');
                $table->dropColumn('subject_code');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('subjects', function (Blueprint $table) {
            if (! Schema::hasColumn('subjects', 'subject_code')) {
                $table->string('subject_code')->nullable()->unique()->after('id');
            }

            if (Schema::hasColumn('subjects', 'subject_type')) {
                $table->dropColumn('subject_type');
            }
        });
    }
};

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
        // Gỡ khóa ngoại trước khi xóa bảng khóa học khỏi database hiện có.
        if (Schema::hasColumn('students', 'course_id')) {
            Schema::table('students', function (Blueprint $table) {
                $table->dropConstrainedForeignId('course_id');
            });
        }

        if (Schema::hasColumn('classes', 'course_id')) {
            Schema::table('classes', function (Blueprint $table) {
                $table->dropConstrainedForeignId('course_id');
            });
        }

        Schema::dropIfExists('courses');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('course_code')->unique();
            $table->string('course_name');
            $table->unsignedSmallInteger('start_year');
            $table->unsignedSmallInteger('end_year');
            $table->boolean('status')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'start_year'], 'courses_status_start_year_index');
        });

        Schema::table('classes', function (Blueprint $table) {
            $table->foreignId('course_id')
                ->nullable()
                ->after('class_name')
                ->constrained('courses')
                ->nullOnDelete()
                ->cascadeOnUpdate();
        });

        Schema::table('students', function (Blueprint $table) {
            $table->foreignId('course_id')
                ->nullable()
                ->after('class_id')
                ->constrained('courses')
                ->nullOnDelete()
                ->cascadeOnUpdate();
        });
    }
};

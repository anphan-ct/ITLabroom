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
        Schema::create('teachers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->cascadeOnDelete()->cascadeOnUpdate();
            $table->string('teacher_code')->unique();
            $table->string('department')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('classes', function (Blueprint $table) {
            $table->id();
            $table->string('class_code')->unique();
            $table->string('major')->nullable();
            $table->foreignId('teacher_id')->nullable()->constrained('teachers')->nullOnDelete()->cascadeOnUpdate();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('class_id')->nullable()->constrained('classes')->nullOnDelete()->cascadeOnUpdate();
            $table->string('student_code')->unique();
            $table->unsignedTinyInteger('role')->default(0)->comment('0: Sinh viên, 1: Lớp trưởng');
            $table->string('course_year')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('subjects', function (Blueprint $table) {
            $table->id();
            $table->string('subject_name');
            $table->enum('subject_type', ['LT', 'TH'])->default('LT')->comment('LT: Lý thuyết, TH: Thực hành');
            $table->unsignedTinyInteger('credits')->default(0);
            $table->text('description')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('shifts', function (Blueprint $table) {
            $table->id();
            $table->string('shift_name');
            $table->time('start_time');
            $table->time('end_time');
            $table->timestamps();
        });

        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->string('room_code')->unique();
            $table->string('room_name');
            $table->unsignedInteger('capacity')->default(0);
            $table->enum('status', ['Đang hoạt động', 'Ngưng hoạt động', 'Đang bảo trì'])->default('Đang hoạt động');
            $table->text('description')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('computer_configs', function (Blueprint $table) {
            $table->id();
            $table->string('cpu')->nullable();
            $table->string('ram')->nullable();
            $table->string('storage')->nullable();
            $table->string('gpu')->nullable();
            $table->string('monitor')->nullable();
            $table->string('os')->nullable();
            $table->text('note')->nullable();
            $table->timestamps();
        });

        Schema::create('computers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('room_id')->constrained('rooms')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('config_id')->nullable()->constrained('computer_configs')->nullOnDelete()->cascadeOnUpdate();
            $table->string('computer_code')->unique();
            $table->string('computer_name');
            $table->string('qr_token')->unique();
            $table->string('ip_address', 45)->nullable()->unique();
            $table->string('mac_address', 17)->nullable()->unique();
            $table->enum('status', ['Sẵn sàng', 'Đang sử dụng', 'Bị hỏng', 'Đang bảo trì', 'Ngoại tuyến'])->default('Sẵn sàng');
            $table->text('note')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('equipments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('room_id')->constrained('rooms')->cascadeOnDelete()->cascadeOnUpdate();
            $table->string('equipment_name');
            $table->unsignedInteger('quantity')->default(1);
            $table->string('unit', 50)->default('Cái');
            $table->enum('status', ['Sẵn sàng', 'Bị hỏng', 'Đang bảo trì', 'Thất lạc'])->default('Sẵn sàng');
            $table->text('note')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('semesters', function (Blueprint $table) {
            $table->id();
            $table->string('semester_name');
            $table->date('start_date');
            $table->date('end_date');
            $table->timestamps();
        });

        Schema::create('teacher_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_id')->constrained('teachers')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('class_id')->constrained('classes')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('subject_id')->constrained('subjects')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('semester_id')->constrained('semesters')->cascadeOnDelete()->cascadeOnUpdate();
            $table->timestamps();

            $table->unique(['teacher_id', 'class_id', 'subject_id', 'semester_id'], 'teacher_assignments_unique');
        });

        Schema::create('schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('class_id')->constrained('classes')->restrictOnDelete()->cascadeOnUpdate();
            $table->foreignId('subject_id')->constrained('subjects')->restrictOnDelete()->cascadeOnUpdate();
            $table->foreignId('semester_id')->constrained('semesters')->restrictOnDelete()->cascadeOnUpdate();
            $table->foreignId('teacher_id')->constrained('teachers')->restrictOnDelete()->cascadeOnUpdate();
            $table->foreignId('room_id')->constrained('rooms')->restrictOnDelete()->cascadeOnUpdate();
            $table->foreignId('shift_id')->constrained('shifts')->restrictOnDelete()->cascadeOnUpdate();
            $table->date('study_date');
            $table->unsignedInteger('week_number')->nullable();
            $table->enum('status', ['Đã lên lịch', 'Đã hoàn thành', 'Đã hủy'])->default('Đã lên lịch');
            $table->text('note')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['room_id', 'shift_id', 'study_date'], 'schedules_room_shift_date_unique');
            $table->unique(['teacher_id', 'shift_id', 'study_date'], 'schedules_teacher_shift_date_unique');
            $table->unique(['class_id', 'shift_id', 'study_date'], 'schedules_class_shift_date_unique');
            $table->index(['class_id', 'study_date']);
            $table->index(['teacher_id', 'study_date']);
        });

        Schema::create('attendance', function (Blueprint $table) {
            $table->id();
            $table->foreignId('schedule_id')->constrained('schedules')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('computer_id')->nullable()->constrained('computers')->nullOnDelete()->cascadeOnUpdate();
            $table->dateTime('check_in_time')->nullable();
            $table->enum('status', ['Có mặt', 'Vắng mặt', 'Đi muộn', 'Có phép'])->default('Vắng mặt');
            $table->text('note')->nullable();
            $table->timestamps();

            $table->unique(['schedule_id', 'student_id'], 'attendance_schedule_student_unique');
            $table->unique(['schedule_id', 'computer_id'], 'attendance_schedule_computer_unique');
        });

        Schema::create('room_booking_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_id')->constrained('teachers')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('room_id')->constrained('rooms')->restrictOnDelete()->cascadeOnUpdate();
            $table->foreignId('subject_id')->nullable()->constrained('subjects')->nullOnDelete()->cascadeOnUpdate();
            $table->date('booking_date');
            $table->foreignId('shift_id')->constrained('shifts')->restrictOnDelete()->cascadeOnUpdate();
            $table->text('purpose');
            $table->enum('approval_status', ['Chờ duyệt', 'Đã duyệt', 'Từ chối', 'Đã hủy'])->default('Chờ duyệt');
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete()->cascadeOnUpdate();
            $table->timestamps();

            $table->index(['room_id', 'shift_id', 'booking_date']);
        });

        Schema::create('loan_requests', function (Blueprint $table) {
            $table->id();
            $table->string('request_code')->unique();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('class_id')->nullable()->constrained('classes')->nullOnDelete()->cascadeOnUpdate();
            $table->foreignId('room_id')->nullable()->constrained('rooms')->nullOnDelete()->cascadeOnUpdate();
            $table->foreignId('computer_id')->nullable()->constrained('computers')->nullOnDelete()->cascadeOnUpdate();
            $table->foreignId('equipment_id')->nullable()->constrained('equipments')->nullOnDelete()->cascadeOnUpdate();
            $table->unsignedInteger('quantity')->default(1);
            $table->dateTime('borrowed_at');
            $table->dateTime('expected_return_at')->nullable();
            $table->dateTime('returned_at')->nullable();
            $table->text('purpose');
            $table->text('note')->nullable();
            $table->enum('status', ['Chờ duyệt', 'Đã duyệt', 'Đang mượn', 'Đã trả', 'Từ chối', 'Quá hạn'])->default('Chờ duyệt');
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete()->cascadeOnUpdate();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['student_id', 'status']);
            $table->index(['room_id', 'borrowed_at']);
        });

        Schema::create('incident_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reported_by_user_id')->constrained('users')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('room_id')->nullable()->constrained('rooms')->nullOnDelete()->cascadeOnUpdate();
            $table->foreignId('computer_id')->nullable()->constrained('computers')->nullOnDelete()->cascadeOnUpdate();
            $table->foreignId('equipment_id')->nullable()->constrained('equipments')->nullOnDelete()->cascadeOnUpdate();
            $table->string('incident_type');
            $table->string('title');
            $table->text('description');
            $table->enum('severity_level', ['Thấp', 'Trung bình', 'Cao', 'Nghiêm trọng'])->default('Trung bình');
            $table->enum('status', ['Đã báo cáo', 'Đang xử lý', 'Đã xử lý', 'Từ chối'])->default('Đã báo cáo');
            $table->timestamps();
        });

        Schema::create('maintenance_tickets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('incident_report_id')->constrained('incident_reports')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete()->cascadeOnUpdate();
            $table->string('maintenance_type');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->text('solution')->nullable();
            $table->decimal('cost', 12, 2)->default(0);
            $table->enum('status', ['Mới tạo', 'Đang thực hiện', 'Hoàn thành', 'Đã hủy'])->default('Mới tạo');
            $table->timestamps();
        });

        Schema::create('computer_status_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('computer_id')->constrained('computers')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('updated_by_user_id')->nullable()->constrained('users')->nullOnDelete()->cascadeOnUpdate();
            $table->string('old_status')->nullable();
            $table->string('new_status');
            $table->text('description')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('computer_status_logs');
        Schema::dropIfExists('maintenance_tickets');
        Schema::dropIfExists('incident_reports');
        Schema::dropIfExists('loan_requests');
        Schema::dropIfExists('room_booking_requests');
        Schema::dropIfExists('attendance');
        Schema::dropIfExists('schedules');
        Schema::dropIfExists('teacher_assignments');
        Schema::dropIfExists('semesters');
        Schema::dropIfExists('equipments');
        Schema::dropIfExists('computers');
        Schema::dropIfExists('computer_configs');
        Schema::dropIfExists('rooms');
        Schema::dropIfExists('shifts');
        Schema::dropIfExists('subjects');
        Schema::dropIfExists('students');
        Schema::dropIfExists('classes');
        Schema::dropIfExists('teachers');
    }
};

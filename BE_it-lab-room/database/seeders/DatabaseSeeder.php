<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\SchoolClass;
use App\Models\Shift;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed dữ liệu tài khoản test đăng nhập cho admin, sinh viên và giảng viên.
     */
    public function run(): void
    {
        $password = Hash::make('Password@123');

        // Tạo danh sách ca học theo buổi để lịch phòng máy dễ quản lý.
        $shifts = [
            ['shift_name' => 'Ca sáng', 'start_time' => '06:30:00', 'end_time' => '11:25:00'],
            ['shift_name' => 'Ca chiều', 'start_time' => '12:30:00', 'end_time' => '17:30:00'],
        ];

        foreach ($shifts as $shift) {
            Shift::query()->updateOrCreate(
                ['shift_name' => $shift['shift_name']],
                [
                    'start_time' => $shift['start_time'],
                    'end_time' => $shift['end_time'],
                ]
            );
        }

        // Tạo role trước để user đăng nhập đúng luồng auth theo từng quyền.
        $adminRole = Role::query()->updateOrCreate(
            ['role_name' => 'admin'],
            ['description' => 'Quản trị viên hệ thống']
        );

        $studentRole = Role::query()->updateOrCreate(
            ['role_name' => 'student'],
            ['description' => 'Sinh viên']
        );

        $teacherRole = Role::query()->updateOrCreate(
            ['role_name' => 'teacher'],
            ['description' => 'Giảng viên']
        );

        $admin = User::query()->updateOrCreate(
            ['email' => 'admin@itlab.test'],
            [
                'role_id' => $adminRole->id,
                'full_name' => 'Admin IT Lab',
                'password' => $password,
                'phone' => '0900000001',
                'gender' => 'Nam',
                'date_of_birth' => '1990-01-01',
                'address' => 'Phòng quản trị IT Lab',
                'status' => 1,
            ]
        );

        $teacherUser = User::query()->updateOrCreate(
            ['email' => 'teacher@itlab.test'],
            [
                'role_id' => $teacherRole->id,
                'full_name' => 'Giảng viên IT Lab',
                'password' => $password,
                'phone' => '0900000002',
                'gender' => 'Nữ',
                'date_of_birth' => '1988-05-10',
                'address' => 'Khoa Công nghệ thông tin',
                'status' => 1,
            ]
        );

        $teacher = Teacher::query()->updateOrCreate(
            ['user_id' => $teacherUser->id],
            [
                'teacher_code' => 'GVTEST001',
                'department' => 'Công nghệ thông tin',
            ]
        );

        $class = SchoolClass::query()->updateOrCreate(
            ['class_code' => 'CTK_TEST_01'],
            [
                'class_name' => 'Lớp test đăng nhập',
                'course_year' => '2022-2026',
                'major' => 'Công nghệ thông tin',
                'teacher_id' => $teacher->id,
            ]
        );

        $studentUser = User::query()->updateOrCreate(
            ['email' => 'student@itlab.test'],
            [
                'role_id' => $studentRole->id,
                'full_name' => 'Sinh viên IT Lab',
                'password' => $password,
                'phone' => '0900000003',
                'gender' => 'Nam',
                'date_of_birth' => '2004-09-15',
                'address' => 'Ký túc xá sinh viên',
                'status' => 1,
            ]
        );

        Student::query()->updateOrCreate(
            ['user_id' => $studentUser->id],
            [
                'class_id' => $class->id,
                'student_code' => 'SVTEST001',
                'role' => 0,
                'course_year' => '2022-2026',
            ]
        );

        $classMonitorUser = User::query()->updateOrCreate(
            ['email' => 'monitor@itlab.test'],
            [
                'role_id' => $studentRole->id,
                'full_name' => 'Lớp trưởng IT Lab',
                'password' => $password,
                'phone' => '0900000004',
                'gender' => 'Nữ',
                'date_of_birth' => '2004-10-20',
                'address' => 'Ký túc xá sinh viên',
                'status' => 1,
            ]
        );

        Student::query()->updateOrCreate(
            ['user_id' => $classMonitorUser->id],
            [
                'class_id' => $class->id,
                'student_code' => 'SVTEST002',
                'role' => 1,
                'course_year' => '2022-2026',
            ]
        );

        // Xóa token cũ của tài khoản test để tránh token tồn đọng sau khi seed lại.
        $admin->tokens()->delete();
        $teacherUser->tokens()->delete();
        $studentUser->tokens()->delete();
        $classMonitorUser->tokens()->delete();
    }
}

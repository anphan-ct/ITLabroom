<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\CourseSection;
use App\Models\Department;
use App\Models\Role;
use App\Models\Room;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\TeacherAssignment;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdditionalAcademicDataSeeder extends Seeder
{
    /**
     * Tạo thêm một bộ dữ liệu giảng viên, lớp, sinh viên và lớp học phần.
     */
    public function run(): void
    {
        $teacherRole = Role::query()->where('ten_vai_tro', 'teacher')->firstOrFail();
        $studentRole = Role::query()->where('ten_vai_tro', 'student')->firstOrFail();
        $department = Department::query()->updateOrCreate(
            ['ma_phong_ban' => 'CNTT'],
            [
                'ten_phong_ban' => 'Khoa Công nghệ thông tin',
                'trang_thai' => 'active',
                'mo_ta' => 'Đơn vị quản lý giảng viên công nghệ thông tin',
            ]
        );
        $academicYear = AcademicYear::query()->where('ten_nam_hoc', '2025-2026')->firstOrFail();
        $room = Room::query()->where('ma_phong', 'PM01')->firstOrFail();

        $teacherUser = User::query()->updateOrCreate(
            ['email' => 'teacher2@itlab.test'],
            [
                'ma_vai_tro' => $teacherRole->id,
                'ho_ten' => 'Nguyễn Minh Anh',
                'mat_khau' => Hash::make('Password@123'),
                'so_dien_thoai' => '0900000012',
                'gioi_tinh' => 'Nữ',
                'ngay_sinh' => '1992-03-18',
                'trang_thai' => 1,
            ]
        );

        $teacher = Teacher::query()->updateOrCreate(
            ['ma_giang_vien' => 'GVTEST002'],
            [
                'ma_nguoi_dung' => $teacherUser->id,
                'ma_phong_ban' => $department->id,
            ]
        );

        $class = SchoolClass::query()->updateOrCreate(
            ['ma_lop' => 'CTK_TEST_02'],
            [
                'nien_khoa' => '2023-2027',
                'chuyen_nganh' => 'Công nghệ thông tin',
                'ma_giang_vien' => $teacher->id,
            ]
        );

        $studentUser = User::query()->updateOrCreate(
            ['email' => 'student2@itlab.test'],
            [
                'ma_vai_tro' => $studentRole->id,
                'ho_ten' => 'Trần Quốc Bảo',
                'mat_khau' => Hash::make('Password@123'),
                'so_dien_thoai' => '0900000022',
                'gioi_tinh' => 'Nam',
                'ngay_sinh' => '2005-07-12',
                'trang_thai' => 1,
            ]
        );

        Student::query()->updateOrCreate(
            ['ma_sinh_vien' => 'SVTEST003'],
            [
                'ma_nguoi_dung' => $studentUser->id,
                'ma_lop' => $class->id,
                'nien_khoa' => '2023-2027',
            ]
        );

        $subject = Subject::query()->updateOrCreate(
            ['ma_mon_hoc' => 'CSDL'],
            [
                'ten_mon' => 'Cơ sở dữ liệu',
                'loai_mon' => 'TH',
                'so_tin_chi' => 3,
                'mo_ta' => 'Môn thực hành cơ sở dữ liệu',
            ]
        );

        $courseSection = CourseSection::query()->updateOrCreate(
            ['ma_lop_hoc_phan' => 'CSDL-01'],
            [
                'ma_mon' => $subject->id,
                'ma_nam_hoc' => $academicYear->id,
                'ma_phong' => $room->id,
                'si_so_toi_da' => 40,
                'trang_thai' => 'active',
                'ghi_chu' => 'Lớp học phần cơ sở dữ liệu',
            ]
        );

        TeacherAssignment::query()->updateOrCreate(
            [
                'ma_giang_vien' => $teacher->id,
                'ma_lop_hoc_phan' => $courseSection->id,
            ],
            [
                'trang_thai' => 'active',
                'ghi_chu' => 'Phân công giảng viên cho lớp CSDL-01',
            ]
        );
    }
}

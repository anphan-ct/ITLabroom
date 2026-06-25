<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\CourseSection;
use App\Models\Room;
use App\Models\SchoolClass;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\TeacherAssignment;
use App\Models\Week;
use Illuminate\Database\Seeder;

class ComputerLabScheduleSeeder extends Seeder
{
    /**
     * Tạo dữ liệu nền tối thiểu để thêm và cập nhật lịch sử dụng phòng máy.
     */
    public function run(): void
    {
        $teacher = Teacher::query()
            ->where('ma_giang_vien', 'GVTEST001')
            ->firstOrFail();

        SchoolClass::query()
            ->where('ma_lop', 'CTK_TEST_01')
            ->firstOrFail();

        $room = Room::query()->updateOrCreate(
            ['ma_phong' => 'PM01'],
            [
                'ten_phong' => 'Phòng máy 01',
                'suc_chua' => 40,
                'trang_thai' => 'active',
                'mo_ta' => 'Phòng máy phục vụ lịch học thực hành',
            ]
        );

        $subject = Subject::query()->updateOrCreate(
            ['ma_mon_hoc' => 'LTWEB'],
            [
                'ten_mon' => 'Lập trình web',
                'loai_mon' => 'TH',
                'so_tin_chi' => 3,
                'mo_ta' => 'Môn thực hành lập trình web',
            ]
        );

        $academicYear = AcademicYear::query()->updateOrCreate(
            ['ten_nam_hoc' => '2025-2026'],
            [
                'ngay_bat_dau' => '2025-09-01',
                'ngay_ket_thuc' => '2026-08-31',
                'trang_thai' => 'active',
            ]
        );

        $weeks = [
            41 => ['2026-06-08', '2026-06-14'],
            42 => ['2026-06-15', '2026-06-21'],
            43 => ['2026-06-22', '2026-06-28'],
            44 => ['2026-06-29', '2026-07-05'],
        ];

        foreach ($weeks as $weekNumber => [$startDate, $endDate]) {
            Week::query()->updateOrCreate(
                [
                    'ma_nam_hoc' => $academicYear->id,
                    'so_tuan' => $weekNumber,
                ],
                [
                    'ngay_bat_dau' => $startDate,
                    'ngay_ket_thuc' => $endDate,
                ]
            );
        }

        $courseSection = CourseSection::query()->updateOrCreate(
            ['ma_lop_hoc_phan' => 'LTWEB-01'],
            [
                'ma_mon' => $subject->id,
                'ma_nam_hoc' => $academicYear->id,
                'ma_phong' => $room->id,
                'si_so_toi_da' => 40,
                'trang_thai' => 'active',
                'ghi_chu' => 'Lớp học phần dùng kiểm thử lịch phòng máy',
            ]
        );

        TeacherAssignment::query()->updateOrCreate(
            [
                'ma_giang_vien' => $teacher->id,
                'ma_lop_hoc_phan' => $courseSection->id,
            ],
            [
                'trang_thai' => 'active',
                'ghi_chu' => 'Phân công giảng viên cho lớp LTWEB-01',
            ]
        );
    }
}

<?php

namespace Database\Seeders;

use App\Models\CourseSection;
use App\Models\CourseSectionStudent;
use App\Models\Student;
use Illuminate\Database\Seeder;

class CourseSectionStudentSeeder extends Seeder
{
    /**
     * Ghi danh hai sinh viên vào các lớp học phần mẫu.
     */
    public function run(): void
    {
        $webCourseSection = CourseSection::query()
            ->where('ma_lop_hoc_phan', 'LTWEB-01')
            ->firstOrFail();
        $databaseCourseSection = CourseSection::query()
            ->where('ma_lop_hoc_phan', 'CSDL-01')
            ->firstOrFail();
        $firstStudent = Student::query()
            ->where('ma_sinh_vien', 'SVTEST001')
            ->firstOrFail();
        $secondStudent = Student::query()
            ->where('ma_sinh_vien', 'SVTEST003')
            ->firstOrFail();

        $enrollments = [
            [$webCourseSection->id, $firstStudent->id, 'Sinh viên lớp thực hành web'],
            [$databaseCourseSection->id, $firstStudent->id, 'Sinh viên học thêm cơ sở dữ liệu'],
            [$databaseCourseSection->id, $secondStudent->id, 'Sinh viên lớp cơ sở dữ liệu'],
        ];

        foreach ($enrollments as [$courseSectionId, $studentId, $note]) {
            CourseSectionStudent::query()->updateOrCreate(
                [
                    'ma_lop_hoc_phan' => $courseSectionId,
                    'ma_sinh_vien' => $studentId,
                ],
                [
                    'trang_thai' => 'active',
                    'ghi_chu' => $note,
                ]
            );
        }
    }
}

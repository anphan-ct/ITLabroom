<?php

namespace App\Http\Controllers\teacher;

use App\Http\Controllers\Controller;
use App\Http\Requests\TeacherAttendanceRequest;
use App\Http\Resources\AttendanceResource;
use App\Http\Resources\ComputerLabScheduleResource;
use App\Models\Attendance;
use App\Models\ComputerLabSchedule;
use App\Models\CourseSectionStudent;
use App\Models\Student;
use Illuminate\Http\JsonResponse;
use Throwable;

class AttendanceController extends Controller
{
    public function showBySchedule(TeacherAttendanceRequest $request, ComputerLabSchedule $computerLabSchedule): JsonResponse
    {
        try {
            $request->validated();
            $teacher = $request->user()?->teacher;

            if (! $teacher) {
                return response()->json([
                    'status' => false,
                    'message' => 'Tài khoản chưa có hồ sơ giảng viên',
                    'error_code' => 403,
                    'data' => '',
                ], 403);
            }

            if ((int) $computerLabSchedule->ma_giang_vien !== (int) $teacher->id) {
                return response()->json([
                    'status' => false,
                    'message' => 'Bạn không có quyền xem điểm danh của lịch dạy này',
                    'error_code' => 403,
                    'data' => '',
                ], 403);
            }

            $computerLabSchedule->load([
                'room:id,ma_phong,ten_phong',
                'class:id,ma_lop',
                'courseSection:id,ma_lop_hoc_phan,ma_mon',
                'courseSection.subject:id,ten_mon',
                'teacher:id,ma_nguoi_dung,ma_giang_vien',
                'teacher.user:id,ho_ten',
                'week:id,so_tuan,ngay_bat_dau,ngay_ket_thuc',
            ]);

            $studentIds = $this->scheduleStudentIds($computerLabSchedule);
            $students = Student::query()
                ->select(['id', 'ma_nguoi_dung', 'ma_lop', 'ma_sinh_vien', 'nien_khoa'])
                ->with(['user:id,ho_ten,email', 'class:id,ma_lop'])
                ->whereIn('id', $studentIds)
                ->orderBy('ma_sinh_vien')
                ->get();

            $attendanceRecords = Attendance::query()
                ->select(['id', 'ma_lich_su_dung', 'ma_sinh_vien', 'ma_may_tinh', 'thoi_gian_check_in', 'trang_thai', 'ghi_chu'])
                ->with(['computer:id,ma_may,ten_may,vi_tri'])
                ->where('ma_lich_su_dung', $computerLabSchedule->id)
                ->whereIn('ma_sinh_vien', $studentIds)
                ->get()
                ->keyBy('ma_sinh_vien');

            // Ghép danh sách sinh viên của buổi học với bản ghi điểm danh nếu sinh viên đã quét QR.
            $attendanceItems = $students->map(fn (Student $student) => [
                'student' => $student,
                'attendance' => $attendanceRecords->get($student->id),
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Lấy danh sách sinh viên điểm danh thành công',
                'error_code' => 200,
                'data' => [
                    'schedule' => new ComputerLabScheduleResource($computerLabSchedule),
                    'summary' => [
                        'total_students' => $students->count(),
                        'checked_in_students' => $attendanceRecords->count(),
                        'absent_students' => max(0, $students->count() - $attendanceRecords->count()),
                    ],
                    'students' => AttendanceResource::collection($attendanceItems),
                ],
            ], 200);
        } catch (Throwable $e) {
            return response()->json([
                'status' => false,
                'message' => 'Không thể lấy danh sách sinh viên điểm danh',
                'error_code' => 500,
                'data' => '',
            ], 500);
        }
    }

    private function scheduleStudentIds(ComputerLabSchedule $schedule)
    {
        $classStudentIds = $schedule->ma_lop
            ? Student::query()
                ->where('ma_lop', $schedule->ma_lop)
                ->whereDoesntHave('courseSectionDetails', function ($detailQuery) use ($schedule) {
                    $detailQuery
                        ->where('ma_lop_hoc_phan', $schedule->ma_lop_hoc_phan)
                        ->where('trang_thai', 'inactive');
                })
                ->pluck('id')
            : collect();

        $courseSectionStudentIds = CourseSectionStudent::query()
            ->where('ma_lop_hoc_phan', $schedule->ma_lop_hoc_phan)
            ->where('trang_thai', 'active')
            ->pluck('ma_sinh_vien');

        return $classStudentIds
            ->merge($courseSectionStudentIds)
            ->map(fn ($studentId) => (int) $studentId)
            ->unique()
            ->values();
    }
}

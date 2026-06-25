<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\CourseSectionRequest;
use App\Http\Resources\CourseSectionResource;
use App\Models\AcademicYear;
use App\Models\CourseSection;
use App\Models\Room;
use App\Models\Subject;
use App\Models\Teacher;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Throwable;

class CourseSectionController extends Controller
{
    public function index(CourseSectionRequest $request)
    {
        try {
            $data = $request->validated();

            $courseSections = CourseSection::query()
                ->select([
                    'id', 'ma_lop_hoc_phan', 'ma_mon', 'ma_nam_hoc', 'ma_phong',
                    'si_so_toi_da', 'trang_thai', 'ghi_chu',
                ])
                ->with($this->relations())
                ->withCount('studentDetails')
                ->when($data['search'] ?? null, function ($query, string $keyword) {
                    $query->where(function ($searchQuery) use ($keyword) {
                        $searchQuery->where('ma_lop_hoc_phan', 'like', "%{$keyword}%")
                            ->orWhereHas('subject', fn ($subjectQuery) => $subjectQuery
                                ->where('ten_mon', 'like', "%{$keyword}%"))
                            ->orWhereHas('academicYear', fn ($yearQuery) => $yearQuery
                                ->where('ten_nam_hoc', 'like', "%{$keyword}%"));
                    });
                })
                ->orderBy('ma_lop_hoc_phan')
                ->get();

            return $this->response(true, 'Lấy danh sách lớp học phần thành công', 200,
                CourseSectionResource::collection($courseSections), 200);
        } catch (Throwable $e) {
            return $this->serverErrorResponse();
        }
    }

    public function options(Request $request)
    {
        try {
            $request->validate([]);

            // Chỉ lấy các cột cần dùng cho các danh sách chọn trên biểu mẫu.
            $subjects = Subject::query()->select(['id', 'ma_mon_hoc', 'ten_mon'])
                ->orderBy('ten_mon')->get();
            $academicYears = AcademicYear::query()->select(['id', 'ten_nam_hoc'])
                ->orderByDesc('ngay_bat_dau')->get();
            $rooms = Room::query()->select(['id', 'ma_phong', 'ten_phong'])
                ->orderBy('ma_phong')->get();
            $teachers = Teacher::query()->select(['id', 'ma_nguoi_dung', 'ma_giang_vien'])
                ->with('user:id,ho_ten')->orderBy('ma_giang_vien')->get()
                ->map(fn (Teacher $teacher) => [
                    'id' => $teacher->id,
                    'ma_giang_vien' => $teacher->ma_giang_vien,
                    'ho_ten' => $teacher->user?->ho_ten,
                ]);

            return $this->response(true, 'Lấy tùy chọn lớp học phần thành công', 200, [
                'subjects' => $subjects,
                'academic_years' => $academicYears,
                'rooms' => $rooms,
                'teachers' => $teachers,
                'statuses' => ['active', 'paused', 'completed'],
            ], 200);
        } catch (Throwable $e) {
            return $this->serverErrorResponse();
        }
    }

    public function store(CourseSectionRequest $request)
    {
        try {
            $data = $request->validated();

            $courseSection = DB::transaction(function () use ($data) {
                $courseSection = CourseSection::create($this->courseSectionData($data));
                $this->syncTeacher($courseSection, $data['ma_giang_vien'] ?? null);

                return $courseSection;
            });
            $this->loadRelations($courseSection);

            return $this->response(true, 'Tạo lớp học phần thành công', 201,
                new CourseSectionResource($courseSection), 201);
        } catch (QueryException $e) {
            return $this->databaseConflictResponse($e);
        } catch (Throwable $e) {
            return $this->serverErrorResponse();
        }
    }

    public function show(Request $request, CourseSection $courseSection)
    {
        try {
            $request->validate([]);
            $this->loadRelations($courseSection);

            return $this->response(true, 'Lấy chi tiết lớp học phần thành công', 200,
                new CourseSectionResource($courseSection), 200);
        } catch (Throwable $e) {
            return $this->serverErrorResponse();
        }
    }

    public function update(CourseSectionRequest $request, CourseSection $courseSection)
    {
        try {
            $data = $request->validated();

            DB::transaction(function () use ($courseSection, $data) {
                // Khóa bản ghi để tránh hai yêu cầu cập nhật phân công cùng lúc.
                $lockedCourseSection = CourseSection::query()->lockForUpdate()->findOrFail($courseSection->id);
                $lockedCourseSection->update($this->courseSectionData($data));
                $this->syncTeacher($lockedCourseSection, $data['ma_giang_vien'] ?? null);
            });
            $courseSection->refresh();
            $this->loadRelations($courseSection);

            return $this->response(true, 'Cập nhật lớp học phần thành công', 200,
                new CourseSectionResource($courseSection), 200);
        } catch (QueryException $e) {
            return $this->databaseConflictResponse($e);
        } catch (Throwable $e) {
            return $this->serverErrorResponse();
        }
    }

    public function destroy(Request $request, CourseSection $courseSection)
    {
        try {
            $request->validate([]);
            $courseSection->loadCount([
                'studentDetails', 'computerLabSchedules', 'roomBookingRequests',
            ]);

            // Giữ lại lớp học phần đã phát sinh dữ liệu nghiệp vụ để bảo toàn lịch sử.
            if ($courseSection->student_details_count > 0
                || $courseSection->computer_lab_schedules_count > 0
                || $courseSection->room_booking_requests_count > 0) {
                return $this->response(false,
                    'Không thể xóa lớp học phần vì đã có sinh viên, lịch học hoặc yêu cầu đặt phòng liên quan',
                    409, '', 409);
            }

            DB::transaction(function () use ($courseSection) {
                $courseSection->assignments()->delete();
                $courseSection->delete();
            });

            return $this->response(true, 'Xóa lớp học phần thành công', 200, '', 200);
        } catch (Throwable $e) {
            return $this->serverErrorResponse();
        }
    }

    private function courseSectionData(array $data): array
    {
        return [
            'ma_lop_hoc_phan' => strtoupper(trim($data['ma_lop_hoc_phan'])),
            'ma_mon' => $data['ma_mon'],
            'ma_nam_hoc' => $data['ma_nam_hoc'],
            'ma_phong' => $data['ma_phong'] ?? null,
            'si_so_toi_da' => $data['si_so_toi_da'],
            'trang_thai' => $data['trang_thai'],
            'ghi_chu' => isset($data['ghi_chu']) ? trim($data['ghi_chu']) : null,
        ];
    }

    private function syncTeacher(CourseSection $courseSection, ?int $teacherId): void
    {
        $courseSection->assignments()->delete();

        if ($teacherId !== null) {
            $courseSection->assignments()->create([
                'ma_giang_vien' => $teacherId,
                'trang_thai' => 'active',
            ]);
        }
    }

    private function relations(): array
    {
        return [
            'subject:id,ma_mon_hoc,ten_mon',
            'academicYear:id,ten_nam_hoc',
            'room:id,ma_phong,ten_phong',
            'assignments:id,ma_lop_hoc_phan,ma_giang_vien',
            'assignments.teacher:id,ma_nguoi_dung,ma_giang_vien',
            'assignments.teacher.user:id,ho_ten',
        ];
    }

    private function loadRelations(CourseSection $courseSection): void
    {
        $courseSection->load($this->relations())->loadCount('studentDetails');
    }

    private function response(bool $status, string $message, int $errorCode, mixed $data, int $httpCode)
    {
        return response()->json([
            'status' => $status,
            'message' => $message,
            'error_code' => $errorCode,
            'data' => $data,
        ], $httpCode);
    }

    private function databaseConflictResponse(QueryException $exception)
    {
        if (in_array((string) $exception->getCode(), ['23000', '23505'], true)) {
            return $this->response(false, 'Mã lớp học phần đã tồn tại hoặc dữ liệu đang được sử dụng',
                409, '', 409);
        }

        return $this->serverErrorResponse();
    }

    private function serverErrorResponse()
    {
        return $this->response(false, 'Hiện tại tôi không thể xử lí yêu cầu của bạn', 500, '', 500);
    }
}

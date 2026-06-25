<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SchoolClassRequest;
use App\Http\Resources\SchoolClassResource;
use App\Models\SchoolClass;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Throwable;

class SchoolClassController extends Controller
{
    public function index(Request $request)
    {
        try {
            $request->validate([]);

            // Load giảng viên chủ nhiệm và đếm sinh viên để tránh N+1 khi hiển thị danh sách.
            $classes = SchoolClass::query()
                ->select(['id', 'ma_lop', 'nien_khoa', 'chuyen_nganh', 'ma_giang_vien'])
                ->with([
                    'teacher:id,ma_nguoi_dung,ma_giang_vien',
                    'teacher.user:id,ho_ten',
                ])
                ->withCount('students')
                ->orderBy('ma_lop')
                ->get();

            return response()->json([
                'status' => true,
                'message' => 'Lấy danh sách lớp học thành công',
                'error_code' => 200,
                'data' => SchoolClassResource::collection($classes),
            ], 200);
        } catch (Throwable $e) {
            return $this->serverErrorResponse();
        }
    }

    public function options(Request $request)
    {
        try {
            $request->validate([]);

            // Chỉ lấy các trường cần thiết cho danh sách chọn giảng viên chủ nhiệm.
            $teachers = Teacher::query()
                ->select(['id', 'ma_nguoi_dung', 'ma_giang_vien'])
                ->with('user:id,ho_ten')
                ->orderBy('ma_giang_vien')
                ->get()
                ->map(fn (Teacher $teacher) => [
                    'id' => $teacher->id,
                    'ma_giang_vien' => $teacher->ma_giang_vien,
                    'ho_ten' => $teacher->user?->ho_ten,
                ]);

            return response()->json([
                'status' => true,
                'message' => 'Lấy tùy chọn lớp học thành công',
                'error_code' => 200,
                'data' => ['teachers' => $teachers],
            ], 200);
        } catch (Throwable $e) {
            return $this->serverErrorResponse();
        }
    }

    public function store(SchoolClassRequest $request)
    {
        try {
            $data = $request->validated();

            // Chuẩn hóa mã lớp trước khi lưu để bảo đảm tính duy nhất nhất quán.
            $class = SchoolClass::create([
                'ma_lop' => strtoupper(trim($data['ma_lop'])),
                'nien_khoa' => trim($data['nien_khoa']),
                'chuyen_nganh' => trim($data['chuyen_nganh']),
                'ma_giang_vien' => $data['ma_giang_vien'] ?? null,
            ]);

            $this->loadClassRelations($class);

            return response()->json([
                'status' => true,
                'message' => 'Tạo lớp học thành công',
                'error_code' => 201,
                'data' => new SchoolClassResource($class),
            ], 201);
        } catch (Throwable $e) {
            return $this->serverErrorResponse();
        }
    }

    public function show(Request $request, SchoolClass $class)
    {
        try {
            $request->validate([]);
            $this->loadClassRelations($class);

            return response()->json([
                'status' => true,
                'message' => 'Lấy chi tiết lớp học thành công',
                'error_code' => 200,
                'data' => new SchoolClassResource($class),
            ], 200);
        } catch (Throwable $e) {
            return $this->serverErrorResponse();
        }
    }

    public function update(SchoolClassRequest $request, SchoolClass $class)
    {
        try {
            $data = $request->validated();

            // Cập nhật lớp học nhưng giữ nguyên sinh viên và lịch đã liên kết.
            $class->update([
                'ma_lop' => strtoupper(trim($data['ma_lop'])),
                'nien_khoa' => trim($data['nien_khoa']),
                'chuyen_nganh' => trim($data['chuyen_nganh']),
                'ma_giang_vien' => $data['ma_giang_vien'] ?? null,
            ]);

            $this->loadClassRelations($class->refresh());

            return response()->json([
                'status' => true,
                'message' => 'Cập nhật lớp học thành công',
                'error_code' => 200,
                'data' => new SchoolClassResource($class),
            ], 200);
        } catch (Throwable $e) {
            return $this->serverErrorResponse();
        }
    }

    public function destroy(Request $request, SchoolClass $class)
    {
        try {
            $request->validate([]);
            $class->loadCount(['students', 'computerLabSchedules']);

            // Không xóa lớp đang có sinh viên hoặc lịch sử dụng phòng máy liên quan.
            if ($class->students_count > 0 || $class->computer_lab_schedules_count > 0) {
                return response()->json([
                    'status' => false,
                    'message' => 'Không thể xóa lớp học vì đã có sinh viên hoặc lịch liên quan',
                    'error_code' => 409,
                    'data' => '',
                ], 409);
            }

            $class->delete();

            return response()->json([
                'status' => true,
                'message' => 'Xóa lớp học thành công',
                'error_code' => 200,
                'data' => '',
            ], 200);
        } catch (Throwable $e) {
            return $this->serverErrorResponse();
        }
    }

    private function loadClassRelations(SchoolClass $class): void
    {
        $class->load([
            'teacher:id,ma_nguoi_dung,ma_giang_vien',
            'teacher.user:id,ho_ten',
        ])->loadCount('students');
    }

    private function serverErrorResponse()
    {
        return response()->json([
            'status' => false,
            'message' => 'Hiện tại tôi không thể xử lí yêu cầu của bạn',
            'error_code' => 500,
            'data' => '',
        ], 500);
    }
}

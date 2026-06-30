<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ClassStudentRequest;
use App\Http\Resources\AdminClassStudentResource;
use App\Models\SchoolClass;
use App\Models\Student;
use Illuminate\Support\Facades\DB;
use Throwable;

class ClassStudentController extends Controller
{
    public function index(ClassStudentRequest $request, SchoolClass $class)
    {
        try {
            $data = $request->validated();

            $keyword = (string) ($data['keyword'] ?? '');
            $perPage = (int) ($data['per_page'] ?? 15);

            // Load sinh viên theo lớp kèm user để tránh N+1 khi render danh sách.
            $students = Student::query()
                ->select([
                    'id',
                    'ma_nguoi_dung',
                    'ma_lop',
                    'ma_sinh_vien',
                    'nien_khoa',
                ])
                ->with([
                    'user:id,ho_ten,email,trang_thai',
                    'class:id,ma_lop',
                ])
                ->where('ma_lop', $class->id)
                ->when($keyword !== '', function ($query) use ($keyword) {
                    $query->where(function ($subQuery) use ($keyword) {
                        $subQuery
                            ->where('ma_sinh_vien', 'like', "%{$keyword}%")
                            ->orWhereHas('user', function ($userQuery) use ($keyword) {
                                $userQuery
                                    ->where('ho_ten', 'like', "%{$keyword}%")
                                    ->orWhere('email', 'like', "%{$keyword}%");
                            });
                    });
                })
                ->orderBy('ma_sinh_vien')
                ->paginate($perPage);

            return response()->json([
                'status' => true,
                'message' => 'Lấy danh sách sinh viên theo lớp thành công',
                'error_code' => 200,
                'data' => [
                    'class' => [
                        'id' => $class->id,
                        'class_code' => $class->ma_lop,
                        'course_year' => $class->nien_khoa,
                    ],
                    'students' => AdminClassStudentResource::collection($students),
                    'pagination' => [
                        'current_page' => $students->currentPage(),
                        'per_page' => $students->perPage(),
                        'total' => $students->total(),
                        'last_page' => $students->lastPage(),
                    ],
                ],
            ], 200);
        } catch (Throwable $e) {
            return response()->json([
                'status' => false,
                'message' => 'Không thể lấy danh sách sinh viên theo lớp',
                'error_code' => 500,
                'data' => '',
            ], 500);
        }
    }

    public function options(ClassStudentRequest $request, SchoolClass $class)
    {
        try {
            $request->validated();

            $students = Student::query()
                ->select(['id', 'ma_nguoi_dung', 'ma_lop', 'ma_sinh_vien', 'nien_khoa'])
                ->with(['user:id,ho_ten,email,trang_thai', 'class:id,ma_lop'])
                ->orderBy('ma_sinh_vien')
                ->get()
                ->map(fn (Student $student) => [
                    'id' => $student->id,
                    'student_code' => $student->ma_sinh_vien,
                    'full_name' => $student->user?->ho_ten,
                    'email' => $student->user?->email,
                    'class_id' => $student->ma_lop,
                    'class_code' => $student->class?->ma_lop,
                    'course_year' => $student->nien_khoa,
                    'is_in_class' => (int) $student->ma_lop === (int) $class->id,
                ]);

            return response()->json([
                'status' => true,
                'message' => 'Lấy danh sách sinh viên để chọn thành công',
                'error_code' => 200,
                'data' => [
                    'students' => $students,
                ],
            ], 200);
        } catch (Throwable $e) {
            return $this->serverErrorResponse('Không thể lấy danh sách sinh viên để chọn');
        }
    }

    public function store(ClassStudentRequest $request, SchoolClass $class)
    {
        try {
            $data = $request->validated();

            $student = DB::transaction(function () use ($class, $data) {
                $student = Student::query()
                    ->whereKey($data['ma_sinh_vien'])
                    ->lockForUpdate()
                    ->firstOrFail();

                // Chuyển sinh viên vào lớp hiện tại.
                $student->update([
                    'ma_lop' => $class->id,
                    'nien_khoa' => $data['nien_khoa'] ?? $student->nien_khoa,
                ]);

                return $student;
            });

            $student->load(['user:id,ho_ten,email,trang_thai', 'class:id,ma_lop']);

            return response()->json([
                'status' => true,
                'message' => 'Thêm sinh viên vào lớp học thành công',
                'error_code' => 201,
                'data' => new AdminClassStudentResource($student),
            ], 201);
        } catch (Throwable $e) {
            return $this->serverErrorResponse('Không thể thêm sinh viên vào lớp học');
        }
    }

    public function update(ClassStudentRequest $request, SchoolClass $class, Student $student)
    {
        try {
            $data = $request->validated();

            DB::transaction(function () use ($class, $student, $data) {
                $targetStudent = Student::query()
                    ->whereKey($data['ma_sinh_vien'])
                    ->lockForUpdate()
                    ->firstOrFail();

                // Cập nhật sinh viên thuộc lớp hiện tại, hỗ trợ thay sinh viên hoặc chỉnh niên khóa.
                $targetStudent->update([
                    'ma_lop' => $class->id,
                    'nien_khoa' => $data['nien_khoa'] ?? $targetStudent->nien_khoa,
                ]);

                if ((int) $student->id !== (int) $targetStudent->id && (int) $student->ma_lop === (int) $class->id) {
                    // Khi thay sinh viên trong lớp, gỡ sinh viên cũ khỏi lớp hiện tại.
                    $student->update(['ma_lop' => null]);
                }
            });

            $student = Student::query()
                ->with(['user:id,ho_ten,email,trang_thai', 'class:id,ma_lop'])
                ->findOrFail($data['ma_sinh_vien']);

            return response()->json([
                'status' => true,
                'message' => 'Cập nhật sinh viên trong lớp học thành công',
                'error_code' => 200,
                'data' => new AdminClassStudentResource($student),
            ], 200);
        } catch (Throwable $e) {
            return $this->serverErrorResponse('Không thể cập nhật sinh viên trong lớp học');
        }
    }

    public function destroy(SchoolClass $class, Student $student)
    {
        try {
            if ((int) $student->ma_lop !== (int) $class->id) {
                return response()->json([
                    'status' => false,
                    'message' => 'Sinh viên không thuộc lớp học này',
                    'error_code' => 404,
                    'data' => '',
                ], 404);
            }

            DB::transaction(function () use ($student) {
                // Chỉ gỡ sinh viên khỏi lớp, không xóa tài khoản hoặc hồ sơ sinh viên.
                Student::query()
                    ->whereKey($student->id)
                    ->lockForUpdate()
                    ->update(['ma_lop' => null]);
            });

            return response()->json([
                'status' => true,
                'message' => 'Gỡ sinh viên khỏi lớp học thành công',
                'error_code' => 200,
                'data' => '',
            ], 200);
        } catch (Throwable $e) {
            return $this->serverErrorResponse('Không thể xóa sinh viên khỏi lớp học');
        }
    }

    private function serverErrorResponse(string $message)
    {
        return response()->json([
            'status' => false,
            'message' => $message,
            'error_code' => 500,
            'data' => '',
        ], 500);
    }
}

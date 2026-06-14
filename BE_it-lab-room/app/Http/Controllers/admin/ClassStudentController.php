<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\AdminClassStudentResource;
use App\Models\SchoolClass;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Throwable;

class ClassStudentController extends Controller
{
    public function index(Request $request, SchoolClass $class)
    {
        try {
            $request->validate([
                'keyword' => 'nullable|string|max:255',
                'per_page' => 'nullable|integer|min:1|max:100',
            ]);

            $keyword = trim((string) $request->input('keyword', ''));
            $perPage = (int) $request->input('per_page', 15);

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
        } catch (ValidationException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Dữ liệu lọc sinh viên không hợp lệ',
                'error_code' => 422,
                'data' => $e->errors(),
            ], 422);
        } catch (Throwable $e) {
            return response()->json([
                'status' => false,
                'message' => 'Không thể lấy danh sách sinh viên theo lớp',
                'error_code' => 500,
                'data' => '',
            ], 500);
        }
    }
}

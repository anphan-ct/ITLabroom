<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\DepartmentResource;
use App\Models\Department;
use Illuminate\Http\JsonResponse;
use Throwable;

class DepartmentController extends Controller
{
    /**
     * Lấy danh sách phòng ban cho dropdown.
     * Chỉ trả về phòng ban đang hoạt động, sắp xếp theo tên.
     */
    public function index(): JsonResponse
    {
        try {
            $departments = Department::query()
                ->select(['id', 'ma_phong_ban', 'ten_phong_ban', 'trang_thai'])
                ->orderBy('ten_phong_ban')
                ->get();

            return response()->json([
                'status' => true,
                'message' => 'Lấy danh sách phòng ban thành công',
                'error_code' => 200,
                'data' => DepartmentResource::collection($departments),
            ], 200);
        } catch (Throwable $e) {
            return response()->json([
                'status' => false,
                'message' => 'Hiện tại không thể xử lý yêu cầu của bạn',
                'error_code' => 500,
                'data' => '',
            ], 500);
        }
    }
}

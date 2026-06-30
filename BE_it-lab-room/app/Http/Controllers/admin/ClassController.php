<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ClassResource;
use App\Models\SchoolClass;
use Illuminate\Http\JsonResponse;
use Throwable;

class ClassController extends Controller
{
    /**
     * Lấy danh sách lớp học cho dropdown.
     * Sắp xếp theo mã lớp.
     */
    public function index(): JsonResponse
    {
        try {
            $classes = SchoolClass::query()
                ->select(['id', 'ma_lop', 'nien_khoa', 'chuyen_nganh'])
                ->orderBy('ma_lop')
                ->get();

            return response()->json([
                'status' => true,
                'message' => 'Lấy danh sách lớp học thành công',
                'error_code' => 200,
                'data' => ClassResource::collection($classes),
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

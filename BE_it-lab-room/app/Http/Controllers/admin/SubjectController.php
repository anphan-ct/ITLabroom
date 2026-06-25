<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SubjectRequest;
use App\Http\Resources\SubjectResource;
use App\Models\Subject;
use Illuminate\Http\Request;
use Throwable;

class SubjectController extends Controller
{
    public function index(Request $request)
    {
        try {
            $request->validate([]);

            $subjects = Subject::query()
                ->select(['id', 'ma_mon_hoc', 'ten_mon', 'loai_mon', 'so_tin_chi', 'mo_ta'])
                ->orderBy('ma_mon_hoc')
                ->orderBy('ten_mon')
                ->get();

            return response()->json([
                'status' => true,
                'message' => 'Lấy danh sách môn học thành công',
                'error_code' => 200,
                'data' => SubjectResource::collection($subjects),
            ], 200);
        } catch (Throwable $e) {
            return $this->serverErrorResponse();
        }
    }

    public function store(SubjectRequest $request)
    {
        try {
            $data = $request->validated();

            // Chuẩn hóa dữ liệu môn học trước khi lưu.
            $subject = Subject::create([
                'ma_mon_hoc' => isset($data['ma_mon_hoc'])
                    ? strtoupper($data['ma_mon_hoc'])
                    : null,
                'ten_mon' => $data['ten_mon'],
                'loai_mon' => $data['loai_mon'],
                'so_tin_chi' => $data['so_tin_chi'],
                'mo_ta' => $data['mo_ta'] ?? null,
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Tạo môn học thành công',
                'error_code' => 201,
                'data' => new SubjectResource($subject),
            ], 201);
        } catch (Throwable $e) {
            return $this->serverErrorResponse();
        }
    }

    public function show(Request $request, Subject $subject)
    {
        try {
            $request->validate([]);

            return response()->json([
                'status' => true,
                'message' => 'Lấy chi tiết môn học thành công',
                'error_code' => 200,
                'data' => new SubjectResource($subject),
            ], 200);
        } catch (Throwable $e) {
            return $this->serverErrorResponse();
        }
    }

    public function update(SubjectRequest $request, Subject $subject)
    {
        try {
            $data = $request->validated();

            // Chỉ cập nhật các trường thuộc danh mục môn học.
            $subject->update([
                'ma_mon_hoc' => isset($data['ma_mon_hoc'])
                    ? strtoupper($data['ma_mon_hoc'])
                    : null,
                'ten_mon' => $data['ten_mon'],
                'loai_mon' => $data['loai_mon'],
                'so_tin_chi' => $data['so_tin_chi'],
                'mo_ta' => $data['mo_ta'] ?? null,
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Cập nhật môn học thành công',
                'error_code' => 200,
                'data' => new SubjectResource($subject->refresh()),
            ], 200);
        } catch (Throwable $e) {
            return $this->serverErrorResponse();
        }
    }

    public function destroy(Request $request, Subject $subject)
    {
        try {
            $request->validate([]);

            // Không xóa môn học đang được lớp học phần sử dụng.
            $subject->loadCount(['courseSections']);

            if ($subject->course_sections_count > 0) {
                return response()->json([
                    'status' => false,
                    'message' => 'Không thể xóa môn học vì đã có dữ liệu liên quan',
                    'error_code' => 409,
                    'data' => '',
                ], 409);
            }

            $subject->delete();

            return response()->json([
                'status' => true,
                'message' => 'Xóa môn học thành công',
                'error_code' => 200,
                'data' => '',
            ], 200);
        } catch (Throwable $e) {
            return $this->serverErrorResponse();
        }
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

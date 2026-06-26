<?php

namespace App\Http\Controllers\student;

use App\Http\Controllers\Controller;
use App\Http\Requests\ComputerLabScheduleRequest;
use App\Http\Resources\ComputerLabScheduleResource;
use App\Models\ComputerLabSchedule;
use App\Models\Week;
use Throwable;

class ComputerLabScheduleController extends Controller
{
    public function index(ComputerLabScheduleRequest $request)
    {
        try {
            $data = $request->validated();
            $student = $request->user()?->student;

            if (! $student) {
                return response()->json([
                    'status' => false,
                    'message' => 'Tài khoản chưa có hồ sơ sinh viên',
                    'error_code' => 403,
                    'data' => '',
                ], 403);
            }

            // Chỉ lấy lịch thuộc lớp học phần mà sinh viên đã được ghi danh.
            $schedules = ComputerLabSchedule::query()
                ->select([
                    'id',
                    'ma_phong',
                    'ma_lop',
                    'ma_lop_hoc_phan',
                    'ma_giang_vien',
                    'ma_tuan',
                    'ngay_hoc_cu_the',
                    'thu_trong_tuan',
                    'so_tiet_bat_dau',
                    'so_tiet_ket_thuc',
                    'loai_lich',
                    'ma_dat_phong_may',
                    'trang_thai',
                    'ghi_chu',
                ])
                ->with([
                    'room:id,ma_phong,ten_phong',
                    'class:id,ma_lop',
                    'courseSection:id,ma_lop_hoc_phan,ma_mon',
                    'courseSection.subject:id,ten_mon',
                    'teacher:id,ma_nguoi_dung,ma_giang_vien',
                    'teacher.user:id,ho_ten',
                    'week:id,so_tuan,ngay_bat_dau,ngay_ket_thuc',
                ])
                ->whereHas('courseSection.studentDetails', function ($query) use ($student) {
                    $query
                        ->where('ma_sinh_vien', $student->id)
                        ->where('trang_thai', 'active');
                })
                ->when($data['week_id'] ?? null, fn ($query, $weekId) => $query->where('ma_tuan', $weekId))
                ->orderBy('ngay_hoc_cu_the')
                ->orderBy('so_tiet_bat_dau')
                ->paginate($data['per_page'] ?? 100);

            // Trả đủ danh sách tuần từ bảng tuần để frontend vẫn chọn được tuần chưa có lịch.
            $weeks = Week::query()
                ->select(['id', 'so_tuan', 'ngay_bat_dau', 'ngay_ket_thuc'])
                ->orderBy('ngay_bat_dau')
                ->get()
                ->map(fn (Week $week) => [
                    'id' => $week->id,
                    'so_tuan' => $week->so_tuan,
                    'ngay_bat_dau' => $week->ngay_bat_dau?->format('Y-m-d'),
                    'ngay_ket_thuc' => $week->ngay_ket_thuc?->format('Y-m-d'),
                ]);

            return response()->json([
                'status' => true,
                'message' => 'Lấy lịch học thành công',
                'error_code' => 200,
                'data' => [
                    'items' => ComputerLabScheduleResource::collection($schedules),
                    'week_options' => $weeks,
                    'pagination' => [
                        'current_page' => $schedules->currentPage(),
                        'per_page' => $schedules->perPage(),
                        'total' => $schedules->total(),
                        'last_page' => $schedules->lastPage(),
                    ],
                ],
            ], 200);
        } catch (Throwable $e) {
            return response()->json([
                'status' => false,
                'message' => 'Không thể lấy lịch học',
                'error_code' => 500,
                'data' => '',
            ], 500);
        }
    }
}

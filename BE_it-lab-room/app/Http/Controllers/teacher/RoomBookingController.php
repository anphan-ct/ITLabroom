<?php

namespace App\Http\Controllers\teacher;

use App\Http\Controllers\Controller;
use App\Http\Requests\TeacherRoomBookingRequest;
use App\Http\Resources\RoomBookingResource;
use App\Http\Resources\RoomResource;
use App\Models\ComputerLabSchedule;
use App\Models\Room;
use App\Models\RoomBooking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Throwable;

class RoomBookingController extends Controller
{
    public function index(TeacherRoomBookingRequest $request)
    {
        try {
            $data = $request->validated();
            $teacher = $request->user()?->teacher;

            if (! $teacher) {
                return $this->forbiddenResponse();
            }

            $bookings = RoomBooking::query()
                ->where('ma_giang_vien', $teacher->id)
                ->when($data['status'] ?? null, fn ($query, $status) => $query->where('trang_thai_duyet', $status))
                ->with($this->relations())
                ->orderByDesc('created_at')
                ->get();

            return response()->json([
                'status' => true,
                'message' => 'Lấy danh sách yêu cầu đặt phòng thành công',
                'error_code' => 200,
                'data' => [
                    'items' => RoomBookingResource::collection($bookings),
                ],
            ], 200);
        } catch (Throwable $e) {
            return $this->serverErrorResponse('Không thể lấy danh sách yêu cầu đặt phòng');
        }
    }

    public function availability(Request $request)
    {
        try {
            $data = $request->validate([
                'date' => ['required', 'date_format:Y-m-d', 'after_or_equal:today'],
                'lesson_start' => ['required', 'integer', 'min:1', 'max:12'],
                'lesson_end' => ['required', 'integer', 'min:1', 'max:12', 'gte:lesson_start'],
            ]);

            $bookingRoomIds = RoomBooking::query()
                ->whereDate('ngay_dat', $data['date'])
                ->where('trang_thai_duyet', 'approved')
                ->where('tiet_bat_dau', '<=', $data['lesson_end'])
                ->where('tiet_ket_thuc', '>=', $data['lesson_start'])
                ->pluck('ma_phong');
            $scheduleRoomIds = ComputerLabSchedule::query()
                ->whereDate('ngay_hoc_cu_the', $data['date'])
                ->where('trang_thai', '!=', 'cancelled')
                ->where('so_tiet_bat_dau', '<=', $data['lesson_end'])
                ->where('so_tiet_ket_thuc', '>=', $data['lesson_start'])
                ->pluck('ma_phong');

            $rooms = Room::query()
                ->select(['id', 'ma_phong', 'ten_phong', 'suc_chua', 'trang_thai', 'mo_ta'])
                // Không hiển thị phòng kho trong danh sách đăng ký phòng.
                ->where('ten_phong', 'not like', '%kho%')
                ->orderBy('ma_phong')
                ->get()
                ->map(function (Room $room) use ($bookingRoomIds, $scheduleRoomIds) {
                    $reason = null;

                    if ($room->trang_thai !== 'active') {
                        $reason = $room->trang_thai === 'maintenance' ? 'maintenance' : 'inactive';
                    } elseif ($scheduleRoomIds->contains($room->id)) {
                        $reason = 'schedule';
                    } elseif ($bookingRoomIds->contains($room->id)) {
                        $reason = 'booking';
                    }

                    return [
                        ...RoomResource::make($room)->resolve(),
                        'is_available' => $reason === null,
                        'unavailable_reason' => $reason,
                    ];
                });

            return response()->json([
                'status' => true,
                'message' => 'Kiểm tra phòng trống thành công',
                'error_code' => 200,
                'data' => ['items' => $rooms],
            ], 200);
        } catch (Throwable $e) {
            return $this->serverErrorResponse('Không thể kiểm tra phòng trống');
        }
    }

    public function store(TeacherRoomBookingRequest $request)
    {
        try {
            $data = $request->validated();
            $teacher = $request->user()?->teacher;

            if (! $teacher) {
                return $this->forbiddenResponse();
            }

            $result = DB::transaction(function () use ($data, $teacher) {
                $room = Room::query()->whereKey($data['ma_phong'])->lockForUpdate()->firstOrFail();

                if (str_contains(mb_strtolower($room->ten_phong ?? ''), 'kho')) {
                    return 'Không thể đăng ký phòng kho.';
                }

                if ($room->trang_thai !== 'active') {
                    return 'Phòng máy hiện không sẵn sàng để đăng ký.';
                }

                if ($this->hasConflict($data)) {
                    return 'Phòng đã có yêu cầu đặt hoặc lịch sử dụng trùng thời gian.';
                }

                return RoomBooking::create([
                    'ma_giang_vien' => $teacher->id,
                    'ma_phong' => $data['ma_phong'],
                    'ngay_dat' => $data['ngay_dat'],
                    'tiet_bat_dau' => $data['so_tiet_bat_dau'],
                    'tiet_ket_thuc' => $data['so_tiet_ket_thuc'],
                    'muc_dich' => $data['muc_dich'],
                    'trang_thai_duyet' => 'pending',
                ]);
            }, 3);

            if (is_string($result)) {
                return response()->json([
                    'status' => false,
                    'message' => $result,
                    'error_code' => 409,
                    'data' => '',
                ], 409);
            }

            $result->load($this->relations());

            return response()->json([
                'status' => true,
                'message' => 'Gửi yêu cầu đặt phòng thành công',
                'error_code' => 201,
                'data' => new RoomBookingResource($result),
            ], 201);
        } catch (Throwable $e) {
            return $this->serverErrorResponse('Không thể gửi yêu cầu đặt phòng');
        }
    }

    private function hasConflict(array $data): bool
    {
        $bookingConflict = RoomBooking::query()
            ->where('ma_phong', $data['ma_phong'])
            ->whereDate('ngay_dat', $data['ngay_dat'])
            ->where('trang_thai_duyet', 'approved')
            ->where('tiet_bat_dau', '<=', $data['so_tiet_ket_thuc'])
            ->where('tiet_ket_thuc', '>=', $data['so_tiet_bat_dau'])
            ->exists();

        return $bookingConflict || ComputerLabSchedule::query()
            ->where('ma_phong', $data['ma_phong'])
            ->whereDate('ngay_hoc_cu_the', $data['ngay_dat'])
            ->where('trang_thai', '!=', 'cancelled')
            ->where('so_tiet_bat_dau', '<=', $data['so_tiet_ket_thuc'])
            ->where('so_tiet_ket_thuc', '>=', $data['so_tiet_bat_dau'])
            ->exists();
    }

    private function relations(): array
    {
        return [
            'room:id,ma_phong,ten_phong',
        ];
    }

    private function forbiddenResponse()
    {
        return response()->json([
            'status' => false,
            'message' => 'Tài khoản chưa có hồ sơ giảng viên',
            'error_code' => 403,
            'data' => '',
        ], 403);
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

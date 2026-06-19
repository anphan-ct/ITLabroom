<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\RoomRequest;
use App\Http\Resources\RoomResource;
use App\Models\Room;
use Illuminate\Http\Request;
use Throwable;

class RoomController extends Controller
{
    public function store(RoomRequest $request)
    {
        try {
            $data = $request->validated();

            $room = Room::create([
                'ma_phong' => strtoupper(trim($data['ma_phong'])),
                'ten_phong' => trim($data['ten_phong']),
                'vi_tri' => $data['vi_tri'] ?? null,
                'suc_chua' => $data['suc_chua'],
                'trang_thai' => $data['trang_thai'] ?? 'active',
                'mo_ta' => $data['mo_ta'] ?? null,
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Tạo phòng máy thành công',
                'error_code' => 201,
                'data' => new RoomResource($room),
            ], 201);
        } catch (Throwable $e) {
            return response()->json([
                'status' => false,
                'message' => 'Hiện tại tôi không thể xử lí yêu cầu của bạn',
                'error_code' => 500,
                'data' => '',
            ], 500);
        }
    }

    public function index()
    {
        try {

            $rooms = Room::query()
                ->select(['id', 'ma_phong', 'ten_phong', 'vi_tri', 'suc_chua', 'trang_thai', 'mo_ta'])
                ->where('trang_thai', 'active')
                ->orderBy('ma_phong')
                ->get();

            return response()->json([
                'status' => true,
                'message' => 'Lấy danh sách phòng máy thành công',
                'error_code' => 200,
                'data' => RoomResource::collection($rooms),
            ], 200);
        } catch (Throwable $e) {
            return response()->json([
                'status' => false,
                'message' => 'Hiện tại tôi không thể xử lí yêu cầu của bạn',
                'error_code' => 500,
                'data' => '',
            ], 500);
        }
    }

    public function destroy(Request $request, Room $room)
    {
        $request->validate([]);

        try {
            
            $room->loadCount([
                'computers',
                'equipments',
                'roomUsageHistories',
                'roomBookingRequests',
            ]);

            if (
                $room->computers_count > 0
                || $room->equipments_count > 0
                || $room->room_usage_histories_count > 0
                || $room->room_booking_requests_count > 0
            ) {
                return response()->json([
                    'status' => false,
                    'message' => 'Không thể xóa phòng máy vì đã có dữ liệu liên quan',
                    'error_code' => 409,
                    'data' => '',
                ], 409);
            }

            $room->delete();

            return response()->json([
                'status' => true,
                'message' => 'Xóa phòng máy thành công',
                'error_code' => 200,
                'data' => '',
            ], 200);
        } catch (Throwable $e) {
            return response()->json([
                'status' => false,
                'message' => 'Hiện tại tôi không thể xử lí yêu cầu của bạn',
                'error_code' => 500,
                'data' => '',
            ], 500);
        }
    }
}

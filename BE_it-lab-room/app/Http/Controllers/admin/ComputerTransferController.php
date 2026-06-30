<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ComputerTransferRequest;
use App\Http\Resources\ComputerTransferHistoryResource;
use App\Models\Computer;
use App\Models\ComputerTransferHistory;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Throwable;

class ComputerTransferController extends Controller
{
    /**
     * Lấy danh sách lịch sử điều chuyển máy tính.
     * Eager load đầy đủ quan hệ để tránh N+1 query.
     */
    public function index()
    {
        try {
            $transfers = ComputerTransferHistory::query()
                ->select([
                    'id',
                    'ma_may_tinh',
                    'ma_phong_cu',
                    'ma_phong_moi',
                    'ma_nguoi_dieu_chuyen',
                    'thoi_gian_dieu_chuyen',
                    'ly_do',
                    'ghi_chu',
                    'created_at',
                ])
                ->with([
                    'computer:id,ma_may,ten_may',
                    'oldRoom:id,ma_phong,ten_phong',
                    'newRoom:id,ma_phong,ten_phong',
                    'transferredBy:id,ho_ten',
                ])
                ->latest('id')
                ->get();

            return response()->json([
                'status'     => true,
                'message'    => 'Lấy danh sách lịch sử điều chuyển thành công',
                'error_code' => 200,
                'data'       => ComputerTransferHistoryResource::collection($transfers),
            ], 200);
        } catch (Throwable $e) {
            return response()->json([
                'status'     => false,
                'message'    => 'Hiện tại tôi không thể xử lí yêu cầu của bạn',
                'error_code' => 500,
                'data'       => '',
            ], 500);
        }
    }

    /**
     * Thực hiện điều chuyển máy tính sang phòng mới.
     * Cập nhật ma_phong trong bảng may_tinh + ghi log vào lich_su_dieu_chuyen_may.
     */
    public function store(ComputerTransferRequest $request)
    {
        try {
            $data = $request->validated();

            $transfer = DB::transaction(function () use ($data) {
                // Lấy máy tính cần điều chuyển, khoá row tránh race condition
                $computer = Computer::lockForUpdate()->findOrFail($data['ma_may_tinh']);

                // Lưu lại phòng cũ trước khi cập nhật
                $maPhongCu = $computer->ma_phong;

                // Cập nhật phòng mới cho máy tính
                $computer->update([
                    'ma_phong' => $data['ma_phong_moi'],
                ]);

                // Ghi log lịch sử điều chuyển
                $transfer = ComputerTransferHistory::create([
                    'ma_may_tinh'           => $computer->id,
                    'ma_phong_cu'           => $maPhongCu,
                    'ma_phong_moi'          => $data['ma_phong_moi'],
                    'ma_nguoi_dieu_chuyen'  => auth()->id(),
                    'thoi_gian_dieu_chuyen' => now(),
                    'ly_do'                 => $data['ly_do'],
                    'ghi_chu'               => $data['ghi_chu'] ?? null,
                ]);

                // Load quan hệ để trả về resource đầy đủ
                return $transfer->load([
                    'computer:id,ma_may,ten_may',
                    'oldRoom:id,ma_phong,ten_phong',
                    'newRoom:id,ma_phong,ten_phong',
                    'transferredBy:id,ho_ten',
                ]);
            });

            return response()->json([
                'status'     => true,
                'message'    => 'Điều chuyển máy tính thành công',
                'error_code' => 200,
                'data'       => new ComputerTransferHistoryResource($transfer),
            ], 200);
        } catch (ValidationException $e) {
            return response()->json([
                'status'     => false,
                'message'    => 'Dữ liệu điều chuyển không hợp lệ',
                'error_code' => 422,
                'data'       => $e->errors(),
            ], 422);
        } catch (Throwable $e) {
            return response()->json([
                'status'     => false,
                'message'    => 'Hiện tại tôi không thể xử lí yêu cầu của bạn',
                'error_code' => 500,
                'data'       => '',
            ], 500);
        }
    }
}

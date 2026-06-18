<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ComputerResource;
use App\Models\Computer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Throwable;

class ComputerController extends Controller
{
    public function index()
    {
        try {
           
            $computers = Computer::query()
                ->select([
                    'id',
                    'ma_phong',
                    'ma_may',
                    'ten_may',
                    'vi_tri',
                    'ma_qr',
                    'bo_xu_ly',
                    'ram',
                    'card_do_hoa',
                    'bo_mach_chu',
                    'man_hinh',
                    'ban_phim',
                    'chuot',
                    'hdd',
                    'ssd',
                    'trang_thai',
                    'ghi_chu',
                ])
                ->with('room:id,ma_phong,ten_phong')
                ->orderBy('ma_may')
                ->get();

            return response()->json([
                'status' => true,
                'message' => 'Lấy danh sách máy tính thành công',
                'error_code' => 200,
                'data' => ComputerResource::collection($computers),
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

    public function show(Computer $computer)
    {
        try {
            
            $computer->load('room:id,ma_phong,ten_phong');

            return response()->json([
                'status' => true,
                'message' => 'Lấy chi tiết máy tính thành công',
                'error_code' => 200,
                'data' => new ComputerResource($computer),
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

    public function destroy(Request $request, Computer $computer)
    {
        $request->validate([]);

        try {
            DB::transaction(function () use ($computer) {
                
                DB::table('chi_tiet_phieu_nhap_may')
                    ->where('ma_may_tinh', $computer->id)
                    ->delete();

                DB::table('chi_tiet_muon_may')
                    ->where('ma_may_tinh', $computer->id)
                    ->delete();

                DB::table('chi_tiet_tra_may')
                    ->where('ma_may_tinh', $computer->id)
                    ->delete();

                
                $computer->delete();
            });

            return response()->json([
                'status' => true,
                'message' => 'Xóa vĩnh viễn máy tính thành công',
                'error_code' => 200,
                'data' => '',
            ], 200);
        } catch (Throwable $e) {
            return response()->json([
                'status' => false,
                'message' => 'Không thể xóa vĩnh viễn máy tính vì đã có dữ liệu liên quan',
                'error_code' => 500,
                'data' => '',
            ], 500);
        }
    }
}

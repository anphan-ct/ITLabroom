<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\GoogleLoginRequest;
use App\Http\Resources\AuthUserResource;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Throwable;
use Google_Client;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        try {
            $credentials = $request->validated();

            // Query user admin kèm role để tránh N+1 và chỉ lấy dữ liệu cần thiết.
            $user = User::query()
                ->select(['id', 'ma_vai_tro', 'ho_ten', 'email', 'mat_khau', 'so_dien_thoai', 'gioi_tinh', 'ngay_sinh', 'trang_thai'])
                ->with(['role:id,ten_vai_tro,mo_ta'])
                ->where('email', $credentials['email'])
                ->whereHas('role', function ($query) {
                    $query->where('ten_vai_tro', 'admin');
                })
                ->first();

            if (! $user || ! Hash::check($credentials['password'], $user->mat_khau)) {
                return response()->json([
                    'status' => false,
                    'message' => 'Email hoặc mật khẩu không chính xác',
                    'error_code' => 401,
                    'data' => '',
                ], 401);
            }

            if ((int) $user->trang_thai !== 1) {
                return response()->json([
                    'status' => false,
                    'message' => 'Tài khoản admin đã bị khóa',
                    'error_code' => 403,
                    'data' => '',
                ], 403);
            }

            // Thu hồi token cũ của admin để hạn chế rủi ro lộ token khi đăng nhập nhiều nơi.
            $user->tokens()->where('name', 'admin_login_token')->delete();
            $token = $user->createToken('admin_login_token', ['admin'])->plainTextToken;

            return response()->json([
                'status' => true,
                'message' => 'Đăng nhập admin thành công',
                'error_code' => 200,
                'data' => [
                    'token_type' => 'Bearer',
                    'access_token' => $token,
                    'user' => new AuthUserResource($user),
                ],
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


    // Đăng nhập bằng Google cho phân hệ: admin.
    // Xác thực token Google, kiểm tra domain, role, trạng thái tài khoản.
    public function googleLogin(GoogleLoginRequest $request)
    {
        $credential = $request->validated('credential');

        try {
            $client = new Google_Client(['client_id' => env('GOOGLE_CLIENT_ID')]);
            $payload = $client->verifyIdToken($credential);

            if (!$payload) {
                return response()->json(['status' => false, 'message' => 'Token Google không hợp lệ.', 'error_code' => 401], 401);
            }

            $email = $payload['email'];

            // Query kiểm tra trực tiếp Admin
            $user = User::query()
                ->select(['id', 'ma_vai_tro', 'ho_ten', 'email', 'mat_khau', 'so_dien_thoai', 'gioi_tinh', 'ngay_sinh', 'trang_thai'])
                ->with(['role:id,ten_vai_tro,mo_ta'])
                ->where('email', $email)
                ->whereHas('role', function ($query) {
                    $query->where('ten_vai_tro', 'admin');
                })
                ->first();

            if (!$user) {
                return response()->json(['status' => false, 'message' => 'Email này không thuộc quyền Quản trị viên!', 'error_code' => 403], 403);
            }

            if ((int) $user->trang_thai !== 1) {
                return response()->json(['status' => false, 'message' => 'Tài khoản admin đã bị khóa', 'error_code' => 403], 403);
            }

            // Xóa token Google cũ và cấp token mới
            $user->tokens()->where('name', 'admin_google_login_token')->delete();
            $token = $user->createToken('admin_google_login_token', ['admin'])->plainTextToken;

            return response()->json([
                'status' => true,
                'message' => 'Đăng nhập Google Admin thành công.',
                'error_code' => 200,
                'data' => [
                    'token_type' => 'Bearer',
                    'access_token' => $token,
                    'user' => new AuthUserResource($user),
                ],
            ], 200);
        } catch (\Exception $e) {
            Log::error('Admin Google Login Error: ' . $e->getMessage());
            return response()->json(['status' => false, 'message' => 'Lỗi máy chủ.', 'error_code' => 500], 500);
        }
    }
}

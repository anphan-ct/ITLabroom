<?php

namespace App\Http\Controllers\student;

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

            // Query student kèm role và hồ sơ sinh viên để tránh N+1 khi trả response.
            $user = User::query()
                ->select(['id', 'ma_vai_tro', 'ho_ten', 'email', 'mat_khau', 'so_dien_thoai', 'gioi_tinh', 'ngay_sinh', 'trang_thai'])
                ->with([
                    'role:id,ten_vai_tro,mo_ta',
                    // Load hồ sơ sinh viên để response không phát sinh N+1.
                    'student:id,ma_nguoi_dung,ma_lop,ma_sinh_vien,nien_khoa',
                    'student.class:id,ma_lop',
                ])
                ->where('email', $credentials['email'])
                ->whereHas('role', function ($query) {
                    $query->where('ten_vai_tro', 'student');
                })
                ->whereHas('student')
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
                    'message' => 'Tài khoản sinh viên đã bị khóa',
                    'error_code' => 403,
                    'data' => '',
                ], 403);
            }

            // Thu hồi token login cũ theo đúng guard sinh viên để giảm rủi ro token tồn đọng.
            $user->tokens()->where('name', 'student_login_token')->delete();
            $token = $user->createToken('student_login_token', ['student'])->plainTextToken;

            return response()->json([
                'status' => true,
                'message' => 'Đăng nhập sinh viên thành công',
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


    // Đăng nhập bằng Google cho phân hệ: student.
    // Xác thực token Google, kiểm tra domain, role, trạng thái tài khoản.
    public function googleLogin(GoogleLoginRequest $request)
    {
        $credential = $request->validated('credential');

        try {
            $client = new Google_Client(['client_id' => env('GOOGLE_CLIENT_ID')]);
            $payload = $client->verifyIdToken($credential);

            if (!$payload) {
                return response()->json([
                    'status' => false,
                    'message' => 'Token Google không hợp lệ.',
                    'error_code' => 401,
                ], 401);
            }

            $email = $payload['email'];

            if (!str_ends_with($email, '@caothang.edu.vn')) {
                return response()->json([
                    'status' => false,
                    'message' => 'Chỉ cho phép email trường Cao Thắng!',
                    'error_code' => 403,
                ], 403);
            }

            $user = User::query()
                ->select(['id', 'ma_vai_tro', 'ho_ten', 'email', 'mat_khau', 'so_dien_thoai', 'gioi_tinh', 'ngay_sinh', 'trang_thai'])
                ->with([
                    'role:id,ten_vai_tro,mo_ta',
                    'student:id,ma_nguoi_dung,ma_lop,ma_sinh_vien,nien_khoa',
                    'student.class:id,ma_lop',
                ])
                ->where('email', $email)
                ->whereHas('role', fn($q) => $q->where('ten_vai_tro', 'student'))
                ->whereHas('student')
                ->first();

            if (!$user) {
                $existsInSystem = User::where('email', $email)->exists();
                $message = $existsInSystem
                    ? 'Tài khoản không có quyền truy cập vào phân hệ sinh viên!'
                    : 'Tài khoản chưa được thêm vào hệ thống IT Lab Room!';

                return response()->json([
                    'status' => false,
                    'message' => $message,
                    'error_code' => 403,
                ], 403);
            }

            if ((int) $user->trang_thai !== 1) {
                return response()->json([
                    'status' => false,
                    'message' => 'Tài khoản đã bị khóa.',
                    'error_code' => 403,
                ], 403);
            }

            $tokenName = 'student_google_login_token';
            $user->tokens()->where('name', $tokenName)->delete();
            $token = $user->createToken($tokenName, ['student'])->plainTextToken;

            return response()->json([
                'status' => true,
                'message' => 'Đăng nhập Google thành công.',
                'error_code' => 200,
                'data' => [
                    'token_type' => 'Bearer',
                    'access_token' => $token,
                    'user' => new AuthUserResource($user),
                ],
            ], 200);
        } catch (\Exception $e) {
            Log::error('Google Login Student Error: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Lỗi máy chủ.',
                'error_code' => 500,
            ], 500);
        }
    }
}

<?php

namespace App\Http\Controllers\member;

use App\Http\Controllers\Controller;
use App\Http\Resources\AuthUserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Throwable;

class AuthController extends Controller
{
    public function studentLogin(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email|max:255',
                'password' => 'required|string|min:6|max:255',
            ]);

            // Query student kèm role và hồ sơ sinh viên để tránh N+1 khi trả response.
            $user = User::query()
                ->select(['id', 'ma_vai_tro', 'ho_ten', 'email', 'mat_khau', 'so_dien_thoai', 'gioi_tinh', 'ngay_sinh', 'trang_thai'])
                ->with([
                    'role:id,ten_vai_tro,mo_ta',
                    // Load hồ sơ sinh viên để response không phát sinh N+1.
                    'student:id,ma_nguoi_dung,ma_lop,ma_sinh_vien,nien_khoa',
                    'student.class:id,ma_lop',
                ])
                ->where('email', $request->email)
                ->whereHas('role', function ($query) {
                    $query->where('ten_vai_tro', 'student');
                })
                ->whereHas('student')
                ->first();

            if (! $user || ! Hash::check($request->password, $user->mat_khau)) {
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
        } catch (ValidationException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Dữ liệu đăng nhập không hợp lệ',
                'error_code' => 422,
                'data' => $e->errors(),
            ], 422);
        } catch (Throwable $e) {
            return response()->json([
                'status' => false,
                'message' => 'Hiện tại tôi không thể xử lí yêu cầu của bạn',
                'error_code' => 500,
                'data' => '',
            ], 500);
        }
    }

    public function teacherLogin(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email|max:255',
                'password' => 'required|string|min:6|max:255',
            ]);

            // Query teacher kèm role và hồ sơ giảng viên để response không phát sinh N+1.
            $user = User::query()
                ->select(['id', 'ma_vai_tro', 'ho_ten', 'email', 'mat_khau', 'so_dien_thoai', 'gioi_tinh', 'ngay_sinh', 'trang_thai'])
                ->with([
                    'role:id,ten_vai_tro,mo_ta',
                    'teacher:id,ma_nguoi_dung,ma_giang_vien',
                ])
                ->where('email', $request->email)
                ->whereHas('role', function ($query) {
                    $query->where('ten_vai_tro', 'teacher');
                })
                ->whereHas('teacher')
                ->first();

            if (! $user || ! Hash::check($request->password, $user->mat_khau)) {
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
                    'message' => 'Tài khoản giảng viên đã bị khóa',
                    'error_code' => 403,
                    'data' => '',
                ], 403);
            }

            // Thu hồi token login cũ theo đúng guard giảng viên để giảm rủi ro token tồn đọng.
            $user->tokens()->where('name', 'teacher_login_token')->delete();
            $token = $user->createToken('teacher_login_token', ['teacher'])->plainTextToken;

            return response()->json([
                'status' => true,
                'message' => 'Đăng nhập giảng viên thành công',
                'error_code' => 200,
                'data' => [
                    'token_type' => 'Bearer',
                    'access_token' => $token,
                    'user' => new AuthUserResource($user),
                ],
            ], 200);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Dữ liệu đăng nhập không hợp lệ',
                'error_code' => 422,
                'data' => $e->errors(),
            ], 422);
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

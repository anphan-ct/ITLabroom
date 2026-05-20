<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\AuthUserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Throwable;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email|max:255',
                'password' => 'required|string|min:6|max:255',
            ]);

            // Query user admin kèm role để tránh N+1 và chỉ lấy dữ liệu cần thiết.
            $user = User::query()
                ->select(['id', 'role_id', 'full_name', 'email', 'password', 'phone', 'gender', 'date_of_birth', 'address', 'status'])
                ->with(['role:id,role_name,description'])
                ->where('email', $request->email)
                ->whereHas('role', function ($query) {
                    $query->where('role_name', 'admin');
                })
                ->first();

            if (! $user || ! Hash::check($request->password, $user->password)) {
                return response()->json([
                    'status' => false,
                    'message' => 'Email hoặc mật khẩu không chính xác',
                    'error_code' => 401,
                    'data' => '',
                ], 401);
            }

            if ((int) $user->status !== 1) {
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

<?php

namespace App\Http\Controllers\common;

use App\Http\Controllers\Controller;
use App\Http\Controllers\admin\AuthController as AdminAuthController;
use App\Http\Controllers\teacher\AuthController as TeacherAuthController;
use App\Http\Controllers\student\AuthController as StudentAuthController;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\GoogleLoginRequest;
use App\Models\User;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    /**
     * Bản đồ vai trò → controller phân hệ tương ứng.
     * Thêm role mới chỉ cần thêm 1 dòng ở đây.
     * Không kiểm tra password, không tạo token, không build response.
     * Nhiệm vụ: kiểm tra email này -> role nào -> gọi controller nào.
     */
    protected function controllerMap(): array
    {
        return [
            'admin' => AdminAuthController::class,
            'teacher' => TeacherAuthController::class,
            'student' => StudentAuthController::class,
        ];
    }

    public function login(LoginRequest $request)
    {
        $email = $request->validated('email');
        $role = $this->resolveRoleByEmail($email);

        return $this->dispatch($role, 'login', $request);
    }

    public function googleLogin(GoogleLoginRequest $request)
    {
        $email = $this->extractEmailFromGoogleCredential($request->validated('credential'));
        $role = $email ? $this->resolveRoleByEmail($email) : null;

        return $this->dispatch($role, 'googleLogin', $request);
    }

    /**
     * Forward request sang đúng AuthController phân hệ.
     * Request truyền đi đã là instance LoginRequest/GoogleLoginRequest hợp lệ
     */
    protected function dispatch(?string $role, string $method, $request)
    {
        $map = $this->controllerMap();

        if (!$role || !isset($map[$role])) {
            return response()->json([
                'status' => false,
                'message' => 'Email không thuộc bất kỳ phân hệ nào trong hệ thống',
                'error_code' => 404,
                'data' => '',
            ], 404);
        }

        return app($map[$role])->{$method}($request);
    }

    protected function resolveRoleByEmail(string $email): ?string
    {
        return User::query()
            ->where('email', $email)
            ->with('role:id,ten_vai_tro')
            ->first()
            ?->role
            ?->ten_vai_tro;
    }

    /**
     * Chỉ decode phần payload JWT để LẤY EMAIL nhằm định tuyến role,
     * KHÔNG dùng để xác thực — việc verify thật (verifyIdToken) vẫn diễn ra
     * trong AuthController phân hệ tương ứng.
     */
    protected function extractEmailFromGoogleCredential(string $credential): ?string
    {
        $parts = explode('.', $credential);
        if (count($parts) < 2) {
            return null;
        }

        $base64 = str_replace(['-', '_'], ['+', '/'], $parts[1]);

    $base64 = str_pad($base64, strlen($base64) + (4 - strlen($base64) % 4) % 4, '=');

    $payload = json_decode(base64_decode($base64), true);

    return $payload['email'] ?? null;
    }
}
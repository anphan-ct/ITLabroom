<?php

use App\Http\Controllers\admin\AuthController as AdminAuthController;
use App\Http\Controllers\admin\ClassController;
use App\Http\Controllers\admin\ClassStudentController;
use App\Http\Controllers\admin\ComputerController;
use App\Http\Controllers\admin\ComputerImportController;
use App\Http\Controllers\admin\ComputerTransferController;
use App\Http\Controllers\admin\DepartmentController;
use App\Http\Controllers\admin\RoomController;
use App\Http\Controllers\admin\UserController;
use App\Http\Controllers\student\AuthController as StudentAuthController;
use App\Http\Controllers\teacher\AuthController as TeacherAuthController;
use App\Http\Controllers\common\AuthController as CommonAuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Nhóm API đăng nhập chuẩn RESTful cho admin, sinh viên và giảng viên.
Route::prefix('auth')->group(function () {
    // Endpoint chung cho giao diện đăng nhập gộp
    Route::post('/login', [CommonAuthController::class, 'login']);
    Route::post('/google-login', [CommonAuthController::class, 'googleLogin']);
    // Login
    Route::post('/admin/login', [AdminAuthController::class, 'login']);
    Route::post('/students/login', [StudentAuthController::class, 'login']);
    Route::post('/teachers/login', [TeacherAuthController::class, 'login']);
    // Google login
    Route::post('/admin/google-login', [AdminAuthController::class, 'googleLogin']);
    Route::post('/students/google-login', [StudentAuthController::class, 'googleLogin']);
    Route::post('/teachers/google-login', [TeacherAuthController::class, 'googleLogin']);
});

// Nhóm API quản lý tài khoản người dùng.
Route::middleware('auth:sanctum')->prefix('admin/users')->group(function () {
    Route::get('/', [UserController::class, 'index']);
    Route::post('/', [UserController::class, 'store']);
    Route::post('/import', [UserController::class, 'import']);
    Route::get('/{user}', [UserController::class, 'show']);
    Route::put('/{user}', [UserController::class, 'update']);
    Route::patch('/{user}/toggle-status', [UserController::class, 'toggleStatus']);
    Route::patch('/{user}/reset-password', [UserController::class, 'resetPassword']);
    Route::delete('/{user}', [UserController::class, 'destroy']);
});

// API lấy danh sách phòng ban cho dropdown.
Route::middleware('auth:sanctum')->get('admin/departments', [DepartmentController::class, 'index']);

// API lấy danh sách lớp học cho dropdown.
Route::middleware('auth:sanctum')->get('admin/classes', [ClassController::class, 'index']);

// Nhóm API quản trị lớp học, dùng để xem sinh viên theo từng lớp.
Route::prefix('admin/classes')->group(function () {
    Route::get('/{class}/students', [ClassStudentController::class, 'index']);
});

// Nhóm API quản trị phòng máy.
Route::prefix('admin/rooms')->group(function () {
    Route::get('/', [RoomController::class, 'index']);
    Route::post('/', [RoomController::class, 'store']);
    Route::delete('/{room}', [RoomController::class, 'destroy']);
});

// Nhóm API quản trị máy tính.
Route::prefix('admin/computers')->group(function () {
    Route::get('/', [ComputerController::class, 'index']);
    Route::get('/{computer}', [ComputerController::class, 'show']);
    Route::delete('/{computer}', [ComputerController::class, 'destroy']);
});

// Nhóm API quản trị phiếu nhập máy, tự sinh máy tính theo số lượng nhập.
Route::prefix('admin/computer-imports')->group(function () {
    Route::get('/', [ComputerImportController::class, 'index']);
    Route::post('/', [ComputerImportController::class, 'store']);
    Route::get('/code', [ComputerImportController::class, 'generateCode']);
    Route::get('/{computerImport}', [ComputerImportController::class, 'show']);
});

// Nhóm API điều chuyển máy tính giữa các phòng.
Route::middleware('auth:sanctum')->prefix('admin/computer-transfers')->group(function () {
    Route::get('/', [ComputerTransferController::class, 'index']);
    Route::post('/', [ComputerTransferController::class, 'store']);
});

